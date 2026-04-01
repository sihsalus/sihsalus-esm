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
  logWarn(`SIHSALUS_BACKEND_URL no definida, usando default: ${backend}`);
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

  app.listen(8080, () => {
    logInfo(`Proxy en puerto 8080 → CLI interno en puerto ${cliPort}`);
    logInfo(`SPA disponible en http://localhost:8080${spaPath}`);
  });

  startCli(['--port', String(cliPort), '--open', 'false', ...cliArgs]);
}

if (devAppsEnv) {
  const apps = devAppsEnv.split(',').map((a) => a.trim()).filter(Boolean);
  const sourcesArgs = apps.flatMap((app) => {
    const dir = resolve(__dirname, '..', 'packages', 'apps', app);
    if (!existsSync(dir)) {
      logFail(`App no encontrada: ${dir}`);
      process.exit(1);
    }
    return ['--sources', dir];
  });

  if (existsSync(assembledImportmap) && existsSync(assembledRoutes)) {
    const importmapAge = Date.now() - statSync(assembledImportmap).mtimeMs;
    const hoursOld = Math.floor(importmapAge / 3_600_000);
    if (hoursOld >= 24) {
      logWarn(`El importmap ensamblado tiene ${hoursOld}h de antigüedad. Considera ejecutar: yarn assemble`);
    }

    // Use reverse proxy: dist/spa bundles + chunks served from same origin
    startWithProxy(['--importmap', assembledImportmap, '--routes', assembledRoutes, ...sourcesArgs]);
  } else {
    logWarn('No se encontró importmap ensamblado. Solo las apps en SIHSALUS_DEV_APPS estarán disponibles.');
    logWarn('Para tener todas las apps: yarn assemble');
    startCli(['--importmap', '{"imports":{}}', '--routes', '{}', ...sourcesArgs]);
  }
} else {
  // No apps to hot-reload: serve the pre-assembled SPA
  if (!existsSync(assembledImportmap)) {
    logFail('No se encontró importmap ensamblado.');
    logFail('  Ejecuta: yarn assemble   (construye el importmap desde los paquetes locales)');
    logFail('  O define SIHSALUS_DEV_APPS=esm-login-app,... para hot-reload');
    process.exit(1);
  }
  logInfo('Sirviendo SPA pre-ensamblado (sin hot-reload). Define SIHSALUS_DEV_APPS para desarrollo.');

  // The openmrs CLI always requires at least one --sources directory with a
  // valid package.json (containing a "browser" field). We point it at
  // esm-login-app as a lightweight shim — the pre-assembled importmap already
  // includes every app, so the dev-server entry for login simply overlaps.
  const shimSource = resolve(__dirname, '..', 'packages', 'apps', 'esm-login-app');
  startCli(['--importmap', assembledImportmap, '--routes', assembledRoutes, '--sources', shimSource]);
}
