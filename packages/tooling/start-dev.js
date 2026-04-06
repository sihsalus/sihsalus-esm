#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { spawn } = require('child_process');
const { existsSync, statSync } = require('fs');
const net = require('net');
const { resolve } = require('path');

const chalk = require('chalk');
const logInfo = (msg) => console.log(`${chalk.green.bold('[start-dev]')} ${msg}`);
const logWarn = (msg) => console.warn(`${chalk.yellow.bold('[start-dev]')} ${chalk.yellow(msg)}`);
const logFail = (msg) => console.error(`${chalk.red.bold('[start-dev]')} ${chalk.red(msg)}`);

const backend =
  process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

if (!process.env.SIHSALUS_BACKEND_URL) {
  logWarn(`SIHSALUS_BACKEND_URL not set, using default: ${backend}`);
}

// SIHSALUS_DEV_APPS=esm-login-app,esm-home-app  → hot-reload those apps
// Unset → serve pre-assembled importmap (no recompilation, just shell + proxy)
const devAppsEnv = process.env.SIHSALUS_DEV_APPS;

const assembledImportmap = resolve(__dirname, '..', 'dist', 'spa', 'importmap.json');
const assembledRoutes = resolve(__dirname, '..', 'dist', 'spa', 'routes.registry.json');
const distSpa = resolve(__dirname, '..', 'dist', 'spa');
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
  const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
  const fullArgs = [openmrsBin, 'develop', '--backend', backend, ...args];

  const child = spawn('node', ['--disable-warning=DEP0060', ...fullArgs], { stdio: 'inherit' });

  child.on('exit', (code) => process.exit(code ?? 1));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));

  return child;
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

  const cliPort = await findFreePort();

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
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  const sourcesArgs = apps.flatMap((app) => {
    const dir = resolve(__dirname, '..', 'packages', 'apps', app);
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
    startWithProxy(['--importmap', assembledImportmap, '--routes', assembledRoutes, ...sourcesArgs]);
  } else {
    logWarn('No assembled importmap found. Only apps in SIHSALUS_DEV_APPS will be available.');
    logWarn('For all apps: yarn assemble');
    startCli(['--importmap', '{"imports":{}}', '--routes', '{}', ...sourcesArgs]);
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

  const shimSource = resolve(__dirname, '..', 'packages', 'apps', 'esm-login-app');
  startWithProxy(['--importmap', assembledImportmap, '--routes', assembledRoutes, '--sources', shimSource]);
}
