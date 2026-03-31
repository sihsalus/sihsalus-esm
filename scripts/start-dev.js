#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { spawn } = require('child_process');
const { existsSync, readFileSync, readdirSync, symlinkSync, unlinkSync, statSync } = require('fs');
const { resolve, join } = require('path');

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

// The app-shell's dist directory — the openmrs CLI serves static files from here.
const shellDist = resolve(
  require.resolve('@openmrs/esm-app-shell/package.json'),
  '..',
  'dist',
);

/**
 * Symlink pre-built bundles and chunks from dist/spa/ into the app-shell dist
 * directory so the openmrs CLI's express.static serves them at /openmrs/spa/.
 *
 * This ensures webpack lazy chunks (including translations) resolve correctly
 * since publicPath:'auto' resolves to /openmrs/spa/ at runtime.
 */
function linkDistSpaIntoShell() {
  if (!existsSync(distSpa)) {
    return [];
  }

  const created = [];
  for (const entry of readdirSync(distSpa)) {
    const src = join(distSpa, entry);
    const dest = join(shellDist, entry);
    if (!existsSync(dest)) {
      symlinkSync(src, dest);
      created.push(dest);
    }
  }

  if (created.length > 0) {
    logInfo(`Enlazados ${created.length} archivos de dist/spa/ en app-shell dist`);
  }

  return created;
}

function cleanupSymlinks(links) {
  for (const link of links) {
    try {
      unlinkSync(link);
    } catch {
      // ignore — best effort cleanup
    }
  }
}

function startDevServer(args) {
  const openmrsBin = resolve(__dirname, '..', 'node_modules', 'openmrs', 'dist', 'cli.js');
  const fullArgs = [openmrsBin, 'develop', '--backend', backend, ...args];

  const child = spawn('node', ['--disable-warning=DEP0060', ...fullArgs], { stdio: 'inherit' });

  child.on('exit', (code) => process.exit(code ?? 1));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
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

    // Symlink dist/spa/ contents into the app-shell dist so the CLI serves
    // pre-built bundles AND their chunks (translations, vendor splits, etc.)
    const createdLinks = linkDistSpaIntoShell();
    process.on('exit', () => cleanupSymlinks(createdLinks));

    // Pass assembled importmap & routes — relative paths resolve correctly
    // because the bundles are now available in the shell dist directory.
    startDevServer(['--importmap', assembledImportmap, '--routes', assembledRoutes, ...sourcesArgs]);
  } else {
    logWarn('No se encontró importmap ensamblado. Solo las apps en SIHSALUS_DEV_APPS estarán disponibles.');
    logWarn('Para tener todas las apps: yarn assemble');
    startDevServer(['--importmap', '{"imports":{}}', '--routes', '{}', ...sourcesArgs]);
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
  startDevServer(['--importmap', assembledImportmap, '--routes', assembledRoutes, '--run-project', 'false']);
}
