#!/usr/bin/env node

require('dotenv').config({ quiet: true });
const { spawn, spawnSync } = require('child_process');
const { existsSync, statSync } = require('fs');
const net = require('net');
const { resolve } = require('path');

const chalk = require('chalk');
const logInfo = (msg) => console.log(`${chalk.green.bold('[start-dev]')} ${msg}`);
const logWarn = (msg) => console.warn(`${chalk.yellow.bold('[start-dev]')} ${chalk.yellow(msg)}`);
const logFail = (msg) => console.error(`${chalk.red.bold('[start-dev]')} ${chalk.red(msg)}`);

const backend = process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

if (!process.env.SIHSALUS_BACKEND_URL) {
  logWarn(`SIHSALUS_BACKEND_URL not set, using default: ${backend}`);
}

// SIHSALUS_DEV_APPS=esm-login-app,esm-home-app  → hot-reload those apps
// Unset → serve pre-assembled importmap (no recompilation, just shell + proxy)
const devAppsEnv = process.env.SIHSALUS_DEV_APPS;

const assembledImportmap = resolve(__dirname, '..', '..', '..', 'dist', 'spa', 'importmap.json');
const assembledRoutes = resolve(__dirname, '..', '..', '..', 'dist', 'spa', 'routes.registry.json');
const distSpa = resolve(__dirname, '..', '..', '..', 'dist', 'spa');
const frontendConfig = resolve(__dirname, '..', '..', '..', 'config', 'frontend.json');
const spaPath = '/openmrs/spa';

function findFreePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

function startCli(args) {
  const openmrsBin = ensureOpenmrsCli();
  const fullArgs = [openmrsBin, 'develop', '--backend', backend, ...args];

  const child = spawn('node', ['--disable-warning=DEP0060', ...fullArgs], { stdio: 'inherit' });

  child.on('exit', (code) => process.exit(code ?? 1));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));

  return child;
}

function withSharedDependencies(args) {
  const sharedDependencies = [
    '@openmrs/esm-styleguide',
    'single-spa',
    'single-spa-react',
    '@openmrs/esm-config',
    '@openmrs/esm-extensions',
    '@openmrs/esm-navigation',
    '@openmrs/esm-offline',
    '@openmrs/esm-react-utils',
    '@openmrs/esm-state',
  ];

  return [...args, ...sharedDependencies.flatMap((dependency) => ['--shared-dependencies', dependency])];
}

function ensureOpenmrsCli() {
  const workspaceRoot = resolve(__dirname, '..', '..', '..');
  const rspackConfigEntry = resolve(workspaceRoot, 'node_modules', '@openmrs', 'rspack-config', 'dist', 'index.js');
  const openmrsBin = resolve(workspaceRoot, 'node_modules', 'openmrs', 'dist', 'cli.js');

  if (!existsSync(rspackConfigEntry)) {
    logWarn('@openmrs/rspack-config no encontrado en dist. Compilando workspace "@openmrs/rspack-config"...');
    runWorkspaceBuild('@openmrs/rspack-config', workspaceRoot);
  }

  if (existsSync(openmrsBin)) {
    return openmrsBin;
  }

  logWarn('openmrs CLI no encontrado en node_modules/openmrs/dist/cli.js. Compilando workspace "openmrs"...');
  runWorkspaceBuild('openmrs', workspaceRoot);

  if (!existsSync(openmrsBin)) {
    logFail('La compilación terminó, pero sigue faltando node_modules/openmrs/dist/cli.js.');
    process.exit(1);
  }

  return openmrsBin;
}

function runWorkspaceBuild(workspaceName, workspaceRoot) {
  const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
  const build = spawnSync(yarnCmd, ['workspace', workspaceName, 'build'], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });

  if (build.error || build.status !== 0) {
    logFail(`No se pudo compilar el workspace "${workspaceName}".`);
    process.exit(build.status || 1);
  }
}

/**
 * Start a reverse proxy on port 8080 that:
 * 1. Serves pre-built bundles and chunks from dist/spa/ for /openmrs/spa/ paths
 * 2. Proxies everything else to the openmrs CLI on an internal port
 *
 * This ensures webpack lazy chunks (translations, vendor splits) resolve correctly
 * because they're served from the same origin (/openmrs/spa/) as the SPA shell,
 * which is where publicPath:'auto' points at runtime.
 */
async function startWithProxy(cliArgs) {
  const express = require('express');
  const { createProxyMiddleware } = require('http-proxy-middleware');

  const configuredCliPort = Number(process.env.SIHSALUS_INTERNAL_CLI_PORT);
  const cliPort =
    Number.isFinite(configuredCliPort) && configuredCliPort > 0 ? configuredCliPort : await findFreePort();

  // Files managed by the openmrs CLI — always proxy these to the CLI
  const cliManagedPaths = new Set(['/importmap.json', '/routes.registry.json', '/routes.json']);

  const app = express();
  const staticHandler = express.static(distSpa, { index: false });

  // Serve pre-built assets from dist/spa/, skip CLI-managed files
  app.use(spaPath, (req, res, next) => {
    if (cliManagedPaths.has(req.path)) {
      return next();
    }
    staticHandler(req, res, next);
  });

  // Proxy everything else to the openmrs CLI (importmap, index.html, API, etc.)
  app.use(
    createProxyMiddleware({
      target: `http://localhost:${cliPort}`,
      ws: true,
      changeOrigin: true,
      logLevel: 'warn',
    }),
  );

  const proxyPort = Number(process.env.SIHSALUS_PORT) || 8080;
  app.listen(proxyPort, () => {
    logInfo(`Proxy :${proxyPort} → internal CLI :${cliPort}`);
    logInfo(`SPA → ${chalk.cyan.underline(`http://localhost:${proxyPort}${spaPath}`)}`);
  });

  startCli(['--port', String(cliPort), '--open', 'false', ...cliArgs]);
}

if (devAppsEnv) {
  const apps = devAppsEnv
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);
  const sourcesArgs = apps.flatMap((app) => {
    const dir = resolve(__dirname, '..', '..', 'apps', app);
    if (!existsSync(dir)) {
      logFail(`App not found: ${dir}`);
      process.exit(1);
    }
    return ['--sources', dir];
  });

  if (existsSync(assembledImportmap) && existsSync(assembledRoutes)) {
    const importmapAge = Date.now() - statSync(assembledImportmap).mtimeMs;
    const hoursOld = Math.floor(importmapAge / 3_600_000);
    if (hoursOld >= 24) {
      logWarn(`Assembled importmap is ${hoursOld}h old. Consider running: yarn assemble`);
    }

    // Use reverse proxy: dist/spa bundles + chunks served from same origin
    startWithProxy(
      withSharedDependencies([
        '--importmap',
        assembledImportmap,
        '--routes',
        assembledRoutes,
        '--config-file',
        frontendConfig,
        ...sourcesArgs,
      ]),
    );
  } else {
    logWarn('No assembled importmap found. Only apps in SIHSALUS_DEV_APPS will be available.');
    logWarn('For all apps: yarn assemble');
    startCli(
      withSharedDependencies([
        '--importmap',
        '{"imports":{}}',
        '--routes',
        '{}',
        '--config-file',
        frontendConfig,
        ...sourcesArgs,
      ]),
    );
  }
} else {
  // No apps to hot-reload: serve the pre-assembled SPA purely via proxy + static files
  if (!existsSync(assembledImportmap)) {
    logFail('No assembled importmap found.');
    logFail('  Run: yarn assemble   (builds the importmap from local packages)');
    logFail('  Or set SIHSALUS_DEV_APPS=esm-login-app,... for hot-reload');
    process.exit(1);
  }
  logInfo('Serving pre-assembled SPA (no hot-reload). Set SIHSALUS_DEV_APPS for development.');
  // The OpenMRS CLI still requires at least one --sources workspace even when
  // the proxy serves a fully assembled importmap. Use a neutral tooling
  // workspace so we don't inject app-specific dev-server clients into the SPA.
  const cliShimSource = resolve(__dirname, '..', 'openmrs');

  startWithProxy(
    withSharedDependencies([
      '--importmap',
      assembledImportmap,
      '--routes',
      assembledRoutes,
      '--config-file',
      frontendConfig,
      '--sources',
      cliShimSource,
    ]),
  );
}
