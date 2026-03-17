const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importmap = { imports: {} };
const routesRegistry = {};
const outDir = 'dist/spa';

// Clean and recreate output directory
fs.mkdirSync(outDir, { recursive: true });

// Find all built app bundles
const appDirs = glob.sync('packages/apps/esm-*/dist');

for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) continue;

  // Use the `browser` field to identify the correct entry bundle
  const browserField = pkg.browser || pkg.module || pkg.main;
  if (!browserField) {
    console.warn(`  SKIP ${pkg.name}: no browser/module/main field`);
    continue;
  }

  const entryFileName = path.basename(browserField);
  const entryFilePath = path.join(distDir, '..', browserField);

  if (!fs.existsSync(entryFilePath)) {
    console.warn(`  SKIP ${pkg.name}: entry bundle not found at ${browserField}`);
    continue;
  }

  // Copy the entry bundle with its unique name (no collisions)
  fs.copyFileSync(entryFilePath, path.join(outDir, entryFileName));
  importmap.imports[pkg.name] = `./${entryFileName}`;

  // Also copy chunk files that the entry bundle may reference (CSS, async chunks)
  for (const file of fs.readdirSync(distDir)) {
    const dest = path.join(outDir, file);
    // Don't overwrite the entry bundle or files from other apps
    if (file === entryFileName) continue;
    // Copy CSS and sourcemap files (these tend to have unique hashed names)
    if (file.endsWith('.css') || file.endsWith('.map')) {
      fs.copyFileSync(path.join(distDir, file), dest);
    }
  }

  // Collect routes
  const routesPath = path.join(distDir, '..', 'src', 'routes.json');
  if (fs.existsSync(routesPath)) {
    routesRegistry[pkg.name] = {
      ...JSON.parse(fs.readFileSync(routesPath, 'utf8')),
      version: pkg.version || '0.0.0',
    };
  }

  console.log(`  OK ${pkg.name} -> ${entryFileName}`);
}

// Copy shell dist (app shell, service worker, CSS, etc.)
const shellDist = 'packages/shell/esm-app-shell/dist';
if (fs.existsSync(shellDist)) {
  for (const file of fs.readdirSync(shellDist)) {
    const dest = path.join(outDir, file);
    // Don't overwrite app bundles with shell files
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(shellDist, file), dest);
    }
  }
  console.log(`  OK app-shell dist copied`);
}

// Write importmap.json to both dist/spa and app-shell dist (for openmrs start)
const importmapJson = JSON.stringify(importmap, null, 2);
fs.writeFileSync(path.join(outDir, 'importmap.json'), importmapJson);

// Also write to app-shell dist so `openmrs start` can find it
const shellImportmapPath = path.join(shellDist, 'importmap.json');
fs.writeFileSync(shellImportmapPath, importmapJson);

// Write routes registry
fs.writeFileSync(
  path.join(outDir, 'routes.registry.json'),
  JSON.stringify(routesRegistry, null, 2),
);
fs.writeFileSync(
  path.join(shellDist, 'routes.registry.json'),
  JSON.stringify(routesRegistry, null, 2),
);

// Verify no duplicate bundle filenames
const values = Object.values(importmap.imports);
const dupes = values.filter((v, i) => values.indexOf(v) !== i);
if (dupes.length > 0) {
  console.error(`\nWARNING: Duplicate bundle filenames detected!`);
  for (const dupe of [...new Set(dupes)]) {
    const apps = Object.entries(importmap.imports)
      .filter(([, v]) => v === dupe)
      .map(([k]) => k);
    console.error(`  ${dupe}: ${apps.join(', ')}`);
  }
}

console.log(`\nImport map generated with ${Object.keys(importmap.imports).length} modules`);
