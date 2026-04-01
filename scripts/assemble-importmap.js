const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const logInfo = (msg) => console.log(`${chalk.green.bold('[assemble]')} ${msg}`);
const logWarn = (msg) => console.warn(`${chalk.yellow.bold('[assemble]')} ${chalk.yellow(msg)}`);
const logFail = (msg) => console.error(`${chalk.red.bold('[assemble]')} ${chalk.red(msg)}`);

const importmap = { imports: {} };
const routesRegistry = {};
const outDir = process.env.SPA_OUTPUT_DIR || 'dist/spa';

/** Ensures resolvedPath stays inside baseDir. Exits on traversal attempt. */
function assertInsideDir(resolvedPath, baseDir, label) {
  const real = path.resolve(resolvedPath);
  const base = path.resolve(baseDir);
  if (!real.startsWith(base + path.sep) && real !== base) {
    logFail(`Path traversal blocked (${label}): ${resolvedPath} escapes ${baseDir}`);
    process.exit(1);
  }
}

// Clean and recreate output directory
fs.mkdirSync(outDir, { recursive: true });

// ── Phase 1: Copy locally-built app bundles (@sihsalus/* and @openmrs/* overrides) ──
logInfo('Phase 1: Local modules');
const appDirs = fs.readdirSync('packages/apps', { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('esm-'))
  .map(d => path.join('packages/apps', d.name, 'dist'))
  .filter(d => fs.existsSync(d));
const localBaseNames = new Set();

// Track packages found locally but without a built dist, for a summary warning
const notBuilt = [];

for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) {
    logInfo(`SKIP ${pkg.name}: private package`);
    continue;
  }

  const isLocalOverride = !pkg.name.startsWith('@sihsalus/');
  const tag = isLocalOverride ? '[override]' : '[local]   ';

  const browserField = pkg.browser || pkg.module || pkg.main;
  if (!browserField) {
    logWarn(`SKIP ${tag} ${pkg.name}: no browser/module/main field in package.json`);
    continue;
  }

  const entryFileName = path.basename(browserField);
  const entryFilePath = path.join(distDir, '..', browserField);
  assertInsideDir(entryFilePath, path.join(distDir, '..'), `${pkg.name} browserField`);

  if (!fs.existsSync(entryFilePath)) {
    notBuilt.push(pkg.name);
    logWarn(`SKIP ${tag} ${pkg.name}: dist not found at ${browserField} — run build first`);
    continue;
  }

  fs.copyFileSync(entryFilePath, path.join(outDir, entryFileName));
  importmap.imports[pkg.name] = `./${entryFileName}`;
  localBaseNames.add(pkg.name.replace(/^@[^/]+\//, ''));

  // Copy chunk files (skip directories and manifests)
  let chunkCount = 0;
  for (const entry of fs.readdirSync(distDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (entry.name === entryFileName) continue;
    if (entry.name.endsWith('.buildmanifest.json')) continue;
    const dest = path.join(outDir, entry.name);
    if (fs.existsSync(dest)) continue;
    fs.copyFileSync(path.join(distDir, entry.name), dest);
    chunkCount++;
  }

  // Collect routes
  const routesPath = path.join(distDir, '..', 'src', 'routes.json');
  if (fs.existsSync(routesPath)) {
    routesRegistry[pkg.name] = {
      ...JSON.parse(fs.readFileSync(routesPath, 'utf8')),
      version: pkg.version || '0.0.0',
    };
  } else {
    logWarn(`${pkg.name}: no routes.json — will have no pages or extensions registered`);
  }

  logInfo(`OK ${tag} ${pkg.name} -> ${entryFileName} (${chunkCount} chunks)`);
}

if (notBuilt.length > 0) {
  logWarn(`${notBuilt.length} local package(s) without dist — run 'yarn build' first:`);
  for (const name of notBuilt) logWarn(`  - ${name}`);
}

// ── Phase 2: Download pinned npm modules from spa-assemble-config.json ────────────
async function downloadNpmModules() {
  const configPath = process.env.SPA_ASSEMBLE_CONFIG || 'config/spa-assemble-config.json';

  if (!fs.existsSync(configPath)) {
    logInfo('Phase 2: npm modules — skipped (config/spa-assemble-config.json not found)');
    return;
  }

  let pacote;
  try {
    pacote = require('pacote');
  } catch (e) {
    logFail(`pacote not available: ${e.message}`);
    process.exit(1);
  }

  const { frontendModules = {} } = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const entries = Object.entries(frontendModules);

  logInfo(`Phase 2: npm modules (${entries.length} pinned)`);

  const os = require('os');
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'sihsalus-assemble-'));

  for (const [name, version] of entries) {
    const baseName = name.replace(/^@[^/]+\//, '');

    if (localBaseNames.has(baseName)) {
      logInfo(`SKIP [npm] ${name}@${version}: local build takes precedence`);
      continue;
    }

    const spec = `${name}@${version}`;
    const tmpDir = path.join(tmpBase, baseName);

    try {
      await pacote.extract(spec, tmpDir, { cache: path.join(tmpBase, '.cache') });

      const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
      const browserField = pkg.browser || pkg.module || pkg.main;

      if (!browserField) {
        logWarn(`SKIP [npm] ${name}: no browser/module/main field in package`);
        continue;
      }

      // Validate browserField doesn't escape the package directory
      assertInsideDir(path.join(tmpDir, browserField), tmpDir, `${name} browserField`);

      // Preserve versioned directory (mirrors upstream convention for chunk resolution)
      const versionedSubdir = `${baseName}-${version}`;
      const versionedDir = path.join(outDir, versionedSubdir);
      fs.mkdirSync(versionedDir, { recursive: true });

      // Copy all files from the package dist directory (recursive for chunks/subdirs)
      const pkgDistDir = path.join(tmpDir, path.dirname(browserField));
      if (fs.existsSync(pkgDistDir) && pkgDistDir !== tmpDir) {
        fs.cpSync(pkgDistDir, versionedDir, { recursive: true, force: true });
      } else {
        // browserField is at the package root (no subdirectory)
        fs.copyFileSync(path.join(tmpDir, browserField), path.join(versionedDir, path.basename(browserField)));
      }

      const entryFileName = path.basename(browserField);
      importmap.imports[name] = `./${versionedSubdir}/${entryFileName}`;

      // Collect routes
      const routesPath = path.join(tmpDir, 'src', 'routes.json');
      if (fs.existsSync(routesPath) && !routesRegistry[name]) {
        routesRegistry[name] = {
          ...JSON.parse(fs.readFileSync(routesPath, 'utf8')),
          version,
        };
      }

      logInfo(`OK [npm] ${name}@${version} -> ${versionedSubdir}/${entryFileName}`);
    } catch (e) {
      logWarn(`[npm] ${spec}: ${e.message} — skipped`);
    }
  }

  // Cleanup tmp dir
  fs.rmSync(tmpBase, { recursive: true, force: true });
}

// ── Phase 3: Copy app-shell dist ──────────────────────────────────────
function copyAppShell() {
  logInfo('Phase 3: App shell');
  let shellDist;
  try {
    shellDist = path.join(path.dirname(require.resolve('@openmrs/esm-app-shell/package.json')), 'dist');
  } catch {
    logWarn('@openmrs/esm-app-shell not found — SPA will have no shell');
    return;
  }

  if (fs.existsSync(shellDist)) {
    fs.cpSync(shellDist, outDir, { recursive: true, force: false });
    logInfo('OK app-shell dist copied');
  }
}

// ── Phase 4: Write importmap.json and routes ──────────────────────────
function writeOutputs() {
  logInfo('Phase 4: Write outputs');
  fs.writeFileSync(path.join(outDir, 'importmap.json'), JSON.stringify(importmap, null, 2));
  fs.writeFileSync(path.join(outDir, 'routes.registry.json'), JSON.stringify(routesRegistry, null, 2));

  // Verify no duplicate bundle filenames
  const values = Object.values(importmap.imports);
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length > 0) {
    logFail('Duplicate bundle names detected — this will cause runtime collisions:');
    for (const dupe of [...new Set(dupes)]) {
      const apps = Object.entries(importmap.imports)
        .filter(([, v]) => v === dupe)
        .map(([k]) => k);
      logFail(`  ${dupe}: ${apps.join(', ')}`);
    }
  }

  // Detect modules in importmap without registered routes
  const withoutRoutes = Object.keys(importmap.imports).filter((name) => !routesRegistry[name]);
  if (withoutRoutes.length > 0) {
    logWarn(`${withoutRoutes.length} module(s) without registered routes (will have no pages/extensions):`);
    for (const name of withoutRoutes) logWarn(`  - ${name}`);
  }

  logInfo(`Import map: ${Object.keys(importmap.imports).length} total modules`);
  logInfo(`Routes: ${Object.keys(routesRegistry).length} modules`);
}

// ── Main ──────────────────────────────────────────────────────────────
(async () => {
  await downloadNpmModules();
  copyAppShell();
  writeOutputs();
  logInfo('Done! dist/spa/ is self-contained.');
})().catch((err) => {
  logFail(err.message);
  process.exit(1);
});
