const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importmap = { imports: {} };
const routesRegistry = [];

// Find all built app bundles
const appDirs = glob.sync('packages/apps/esm-*/dist');

for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) continue; // Skip _upstream and disabled packages

  const bundleFiles = fs.readdirSync(distDir).filter(
    (f) => f.endsWith('.js') && !f.includes('.map'),
  );

  if (bundleFiles.length > 0) {
    importmap.imports[pkg.name] = `./${bundleFiles[0]}`;
  }

  // Collect routes
  const routesPath = path.join(distDir, '..', 'src', 'routes.json');
  if (fs.existsSync(routesPath)) {
    routesRegistry.push(JSON.parse(fs.readFileSync(routesPath, 'utf8')));
  }
}

// Write outputs
const outDir = 'dist/spa';
fs.mkdirSync(outDir, { recursive: true });

// Copy all dist bundles to spa dir
for (const distDir of appDirs) {
  const pkgJsonPath = path.join(distDir, '..', 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (pkg.private) continue;

  for (const file of fs.readdirSync(distDir)) {
    fs.copyFileSync(path.join(distDir, file), path.join(outDir, file));
  }
}

// Copy shell dist
const shellDist = 'packages/shell/esm-app-shell/dist';
if (fs.existsSync(shellDist)) {
  for (const file of fs.readdirSync(shellDist)) {
    fs.copyFileSync(path.join(shellDist, file), path.join(outDir, file));
  }
}

fs.writeFileSync(path.join(outDir, 'importmap.json'), JSON.stringify(importmap, null, 2));
fs.writeFileSync(
  path.join(outDir, 'routes.registry.json'),
  JSON.stringify(routesRegistry, null, 2),
);

console.log(`Import map generated with ${Object.keys(importmap.imports).length} modules`);
