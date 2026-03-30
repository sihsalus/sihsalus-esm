const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importmap = { imports: {} };
const routesRegistry = {};
const outDir = 'dist/spa';

// Backend URL for downloading pre-built @openmrs/* modules (only used at build time)
const BACKEND_URL = process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

// Clean and recreate output directory
fs.mkdirSync(outDir, { recursive: true });

// ── Phase 1: Copy locally-built app bundles (@sihsalus/* and @openmrs/* overrides) ──
console.log('\n=== Phase 1: Local modules ===');
const appDirs = glob.sync('packages/apps/esm-*/dist');
const localBaseNames = new Set();

// Track packages found locally but without a built dist, for a summary warning
const notBuilt = [];

for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) {
    console.log(`  SKIP ${pkg.name}: private package`);
    continue;
  }

  const isLocalOverride = !pkg.name.startsWith('@sihsalus/');
  const tag = isLocalOverride ? '[override]' : '[local]   ';

  const browserField = pkg.browser || pkg.module || pkg.main;
  if (!browserField) {
    console.warn(`  SKIP ${tag} ${pkg.name}: no browser/module/main field`);
    continue;
  }

  const entryFileName = path.basename(browserField);
  const entryFilePath = path.join(distDir, '..', browserField);

  if (!fs.existsSync(entryFilePath)) {
    notBuilt.push(pkg.name);
    console.warn(`  SKIP ${tag} ${pkg.name}: dist not found at ${browserField} — run build first`);
    continue;
  }

  fs.copyFileSync(entryFilePath, path.join(outDir, entryFileName));
  importmap.imports[pkg.name] = `./${entryFileName}`;
  localBaseNames.add(pkg.name.replace(/^@[^/]+\//, ''));

  // Copy chunk files
  let chunkCount = 0;
  for (const file of fs.readdirSync(distDir)) {
    if (file === entryFileName) continue;
    if (file.endsWith('.buildmanifest.json')) continue;
    const dest = path.join(outDir, file);
    if (fs.existsSync(dest)) continue;
    fs.copyFileSync(path.join(distDir, file), dest);
    chunkCount++;
  }

  // Collect routes
  const routesPath = path.join(distDir, '..', 'src', 'routes.json');
  if (fs.existsSync(routesPath)) {
    routesRegistry[pkg.name] = {
      ...JSON.parse(fs.readFileSync(routesPath, 'utf8')),
      version: pkg.version || '0.0.0',
    };
  }

  console.log(`  OK  ${tag} ${pkg.name} -> ${entryFileName} (${chunkCount} chunks)`);
}

if (notBuilt.length > 0) {
  console.warn(`\n  WARNING: ${notBuilt.length} local package(s) have no dist — they will be fetched from the backend:`);
  for (const name of notBuilt) console.warn(`    - ${name}`);
}

// ── Phase 2: Download @openmrs/* modules from backend ─────────────────
console.log('\n=== Phase 2: Download backend modules ===');

async function downloadBackendModules() {
  console.log(`  Fetching importmap from ${BACKEND_URL}...`);

  // Fetch backend importmap
  let backendImportmap;
  try {
    const resp = await fetch(`${BACKEND_URL}/openmrs/spa/importmap.json`);
    backendImportmap = await resp.json();
  } catch (e) {
    console.error(`  ERROR: Cannot fetch backend importmap: ${e.message}`);
    console.error('  Set SIHSALUS_BACKEND_URL to your backend server URL');
    process.exit(1);
  }

  // Fetch backend routes
  let backendRoutes = {};
  try {
    const resp = await fetch(`${BACKEND_URL}/openmrs/spa/routes.registry.json`);
    backendRoutes = await resp.json();
  } catch (e) {
    console.warn(`  WARN: Cannot fetch backend routes: ${e.message}`);
  }

  // Known aliases: backend modules that map to different local names
  // When a local app replaces a backend module with a different name,
  // add the mapping here so the backend version gets excluded.
  const BACKEND_ALIASES = {
    'esm-indicators-app': 'esm-indicadores-app',
    'esm-patient-immunizations-app': 'esm-vacunacion-app',
  };
  for (const [backendName, localName] of Object.entries(BACKEND_ALIASES)) {
    if (localBaseNames.has(localName)) localBaseNames.add(backendName);
  }

  const backendEntries = Object.entries(backendImportmap.imports || {});
  console.log(`  Backend has ${backendEntries.length} modules`);
  console.log(`  Local overrides (will skip backend version): ${[...localBaseNames].join(', ') || '(none)'}`);

  let downloaded = 0;
  let skipped = 0;
  const skippedNames = [];

  for (const [name, relUrl] of backendEntries) {
    const baseName = name.replace(/^@[^/]+\//, '');

    // Skip if we have a local version (covers @sihsalus/* and @openmrs/* local overrides)
    if (localBaseNames.has(baseName)) {
      skippedNames.push(name);
      skipped++;
      continue;
    }

    // Backend modules live in subdirectories: ./openmrs-esm-foo-app-1.0.0/openmrs-esm-foo-app.js
    // We must preserve this directory structure so chunk imports work correctly
    const cleanRelUrl = relUrl.replace(/^\.\//, '');
    const subDir = path.dirname(cleanRelUrl); // e.g. "openmrs-esm-foo-app-1.0.0"
    const localSubDir = path.join(outDir, subDir);
    const fullUrl = `${BACKEND_URL}/openmrs/spa/${cleanRelUrl}`;

    // Create subdirectory
    fs.mkdirSync(localSubDir, { recursive: true });

    // Download entry bundle
    const entryFile = path.basename(cleanRelUrl);
    const entryDest = path.join(localSubDir, entryFile);

    if (!fs.existsSync(entryDest)) {
      try {
        const resp = await fetch(fullUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        fs.writeFileSync(entryDest, Buffer.from(await resp.arrayBuffer()));
      } catch (e) {
        console.warn(`  SKIP ${name}: download failed (${e.message})`);
        continue;
      }
    }

    // Keep the same relative path so chunks resolve correctly
    importmap.imports[name] = `./${cleanRelUrl}`;
    downloaded++;

    // Download all chunk files from the same directory using buildmanifest
    try {
      const manifestUrl = `${fullUrl}.buildmanifest.json`;
      const mResp = await fetch(manifestUrl);
      if (mResp.ok) {
        const manifest = await mResp.json();
        // Extract chunk file names from chunks[].files and chunks[].auxiliaryFiles
        const chunkFiles = new Set();
        for (const chunk of (manifest.chunks || [])) {
          for (const f of (chunk.files || [])) chunkFiles.add(f);
          for (const f of (chunk.auxiliaryFiles || [])) chunkFiles.add(f);
        }
        // Also check top-level files
        for (const f of (manifest.files || [])) chunkFiles.add(f);

        let dlCount = 0;
        for (const chunkFile of chunkFiles) {
          const chunkDest = path.join(localSubDir, chunkFile);
          if (!fs.existsSync(chunkDest)) {
            try {
              const cResp = await fetch(`${BACKEND_URL}/openmrs/spa/${subDir}/${chunkFile}`);
              if (cResp.ok) {
                fs.writeFileSync(chunkDest, Buffer.from(await cResp.arrayBuffer()));
                dlCount++;
              }
            } catch { /* skip failed chunks */ }
          }
        }
        console.log(`  OK ${name} (${dlCount} chunks)`);
      } else {
        console.log(`  OK ${name} (no manifest)`);
      }
    } catch {
      console.log(`  OK ${name} (no manifest)`);
    }

    // Merge routes
    if (backendRoutes[name] && !routesRegistry[name]) {
      routesRegistry[name] = backendRoutes[name];
    }
  }

  console.log(`  Downloaded: ${downloaded} | Skipped (local override): ${skipped}`);
  if (skippedNames.length > 0) {
    console.log('  Skipped modules (local build used instead):');
    for (const name of skippedNames) console.log(`    - ${name}`);
  }
}

// ── Phase 3: Copy app-shell dist ──────────────────────────────────────
function copyAppShell() {
  console.log('\n=== Phase 3: App shell ===');
  let shellDist;
  try {
    shellDist = path.join(path.dirname(require.resolve('@openmrs/esm-app-shell/package.json')), 'dist');
  } catch {
    console.warn('  WARN: @openmrs/esm-app-shell not found');
    return;
  }

  if (fs.existsSync(shellDist)) {
    for (const file of fs.readdirSync(shellDist)) {
      const dest = path.join(outDir, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(shellDist, file), dest);
      }
    }
    console.log(`  OK app-shell dist copied`);
  }
}

// ── Phase 4: Write importmap.json and routes ──────────────────────────
function writeOutputs() {
  console.log('\n=== Phase 4: Write outputs ===');
  const importmapJson = JSON.stringify(importmap, null, 2);
  fs.writeFileSync(path.join(outDir, 'importmap.json'), importmapJson);

  fs.writeFileSync(
    path.join(outDir, 'routes.registry.json'),
    JSON.stringify(routesRegistry, null, 2),
  );

  // Verify no duplicate bundle filenames
  const values = Object.values(importmap.imports);
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length > 0) {
    console.error(`\n  WARNING: Duplicate bundle filenames detected!`);
    for (const dupe of [...new Set(dupes)]) {
      const apps = Object.entries(importmap.imports)
        .filter(([, v]) => v === dupe)
        .map(([k]) => k);
      console.error(`    ${dupe}: ${apps.join(', ')}`);
    }
  }

  const localCount = Object.values(importmap.imports).filter(v => v.startsWith('./')).length;
  const remoteCount = Object.keys(importmap.imports).length - localCount;
  console.log(`\n  Import map: ${localCount} local + ${remoteCount} remote = ${Object.keys(importmap.imports).length} total`);
  console.log(`  Routes: ${Object.keys(routesRegistry).length} modules`);
}

// ── Main ──────────────────────────────────────────────────────────────
(async () => {
  await downloadBackendModules();
  copyAppShell();
  writeOutputs();
  console.log('\nDone! dist/spa/ is self-contained.');
})();
