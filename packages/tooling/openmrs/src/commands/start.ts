import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { logInfo, logWarn, removeTrailingSlash } from '../utils';

/* eslint-disable no-console */

export interface StartArgs {
  port: number;
  host: string;
  open: boolean;
  backend: string;
  addCookie: string;
}

async function fetchBackendJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return (await response.json()) as Record<string, unknown>;
    }
  } catch {
    // Backend not reachable — that's fine, we proceed with local-only
  }
  return null;
}

interface LocalDiscovery {
  importmap: { imports: Record<string, string> };
  routes: Record<string, unknown>;
  distDirs: string[];
}

/**
 * Auto-discover locally-built @sihsalus/* modules from packages/apps/,
 * eliminating the need for `yarn assemble` during development.
 */
function discoverLocalModules(rootDir: string): LocalDiscovery {
  const importmap: { imports: Record<string, string> } = { imports: {} };
  const routes: Record<string, unknown> = {};
  const distDirs: string[] = [];

  const appsDir = resolve(rootDir, 'packages', 'apps');
  if (!existsSync(appsDir)) return { importmap, routes, distDirs };

  const entries = readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('esm-')) continue;

    const pkgJsonPath = resolve(appsDir, entry.name, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    if (pkg.private || !pkg.name?.startsWith('@sihsalus/')) continue;

    const distDir = resolve(appsDir, entry.name, 'dist');
    if (!existsSync(distDir)) continue;

    const browserField = pkg.browser || pkg.module || pkg.main;
    if (!browserField) continue;

    const entryFile = basename(browserField);
    const entryPath = resolve(appsDir, entry.name, browserField);
    if (!existsSync(entryPath)) continue;

    importmap.imports[pkg.name] = `./${entryFile}`;
    distDirs.push(distDir);

    const routesPath = resolve(appsDir, entry.name, 'src', 'routes.json');
    if (existsSync(routesPath)) {
      routes[pkg.name] = {
        ...JSON.parse(readFileSync(routesPath, 'utf8')),
        version: pkg.version || '0.0.0',
      };
    }

    logInfo(`  Discovered ${pkg.name} -> ${entryFile}`);
  }

  return { importmap, routes, distDirs };
}

export async function runStart(args: StartArgs) {
  const { backend, host, port, open, addCookie } = args;
  const expressApp = express();
  const shellDist = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..', 'dist');
  const spaDist = resolve(process.cwd(), 'dist', 'spa');
  const spaPath = '/openmrs/spa';
  const backendUrl = removeTrailingSlash(backend);
  const pageUrl = `http://${host}:${port}${spaPath}`;

  // Rewrite index.html to use local importmap and routes instead of dev3.openmrs.org
  const indexContent = readFileSync(resolve(shellDist, 'index.html'), 'utf8')
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa\/importmap\.json/g, `${spaPath}/importmap.json`)
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa/g, spaPath)
    .replace(/href="\/openmrs\/spa/g, `href="${spaPath}`)
    .replace(/src="\/openmrs\/spa/g, `src="${spaPath}`);

  // Auto-discover locally-built @sihsalus/* modules directly from packages/apps/
  logInfo('Discovering local @sihsalus/* modules...');
  const discovery = discoverLocalModules(process.cwd());
  const localImportmap = discovery.importmap;

  logInfo(`Local modules: ${Object.keys(localImportmap.imports).length}`);

  logInfo(`Fetching backend importmap from ${backendUrl}...`);
  const backendImportmap = (await fetchBackendJson(`${backendUrl}/openmrs/spa/importmap.json`)) as {
    imports?: Record<string, string>;
  } | null;

  const mergedImportmap: { imports: Record<string, string> } = { imports: {} };

  // Build a set of "base names" from local modules to detect duplicates under different scopes
  // e.g. local "@sihsalus/esm-fua-app" should exclude backend "@pucp-gidis-hiisc/esm-fua-app"
  const localBaseNames = new Set(
    Object.keys(localImportmap.imports).map((name) => name.replace(/^@[^/]+\//, '')),
  );

  if (backendImportmap?.imports) {
    let skippedCount = 0;
    for (const [name, url] of Object.entries(backendImportmap.imports)) {
      const baseName = name.replace(/^@[^/]+\//, '');
      if (localBaseNames.has(baseName)) {
        skippedCount++;
        continue;
      }
      const resolvedUrl = url.startsWith('.') ? `${backendUrl}/openmrs/spa/${url.replace(/^\.\//, '')}` : url;
      mergedImportmap.imports[name] = resolvedUrl;
    }
    logInfo(`Backend importmap: ${Object.keys(backendImportmap.imports).length} modules (${skippedCount} skipped as local duplicates)`);
  } else {
    logWarn(`Could not fetch backend importmap — using local modules only`);
  }

  // Local modules override backend
  for (const [name, url] of Object.entries(localImportmap.imports)) {
    mergedImportmap.imports[name] = url;
  }

  const localCount = Object.keys(localImportmap.imports).length;
  const totalCount = Object.keys(mergedImportmap.imports).length;
  const backendOnlyCount = totalCount - localCount;
  logInfo(`Merged importmap: ${localCount} local + ${backendOnlyCount} from backend = ${totalCount} total`);

  // Build merged routes
  const localRoutes = discovery.routes;

  const backendRoutes = (await fetchBackendJson(`${backendUrl}/openmrs/spa/routes.registry.json`)) as Record<
    string,
    unknown
  > | null;

  const mergedRoutes: Record<string, unknown> = {};
  if (backendRoutes) {
    for (const [name, config] of Object.entries(backendRoutes)) {
      const baseName = name.replace(/^@[^/]+\//, '');
      if (localBaseNames.has(baseName)) continue;
      mergedRoutes[name] = config;
    }
  }
  Object.assign(mergedRoutes, localRoutes);

  // Serve merged importmap and routes as JSON endpoints
  const importmapJson = JSON.stringify(mergedImportmap);
  const routesJson = JSON.stringify(mergedRoutes);

  expressApp.get(`${spaPath}/importmap.json`, (_, res) => {
    res.contentType('application/json').send(importmapJson);
  });

  expressApp.get(`${spaPath}/routes.registry.json`, (_, res) => {
    res.contentType('application/json').send(routesJson);
  });

  // Serve rewritten index.html for SPA routes (before static assets)
  const indexHtmlPathMatcher = /\/openmrs\/spa\/(?!.*\.(js|woff2?|json|css|.{2,3}$)).*$/;
  expressApp.get(indexHtmlPathMatcher, (_, res) => res.contentType('text/html').send(indexContent));

  // Serve local module dist directories (auto-discovered from packages/apps/)
  for (const distDir of discovery.distDirs) {
    expressApp.use(spaPath, express.static(distDir, { index: false }));
  }

  // Fallback to dist/spa if it exists (from yarn assemble)
  if (existsSync(spaDist)) {
    expressApp.use(spaPath, express.static(spaDist, { index: false }));
  }
  expressApp.use(spaPath, express.static(shellDist, { index: false }));

  // Proxy all /openmrs/* API requests to the backend
  expressApp.use(
    '/openmrs',
    createProxyMiddleware([`/openmrs/**`, `!${spaPath}/**`], {
      target: backend,
      changeOrigin: true,
      onProxyReq(proxyReq) {
        if (addCookie) {
          const origCookie = proxyReq.getHeader('cookie');
          const newCookie = `${origCookie};${addCookie}`;
          proxyReq.setHeader('cookie', newCookie);
        }
      },
    }),
  );

  // Fallback: serve index.html for any unmatched route (SPA client-side routing)
  expressApp.get('/*', (_, res) => res.contentType('text/html').send(indexContent));

  expressApp.listen(port, host, () => {
    logInfo(`Listening at http://${host}:${port}`);
    logInfo(`SPA available at ${pageUrl}`);

    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const open = require('open');

      open(pageUrl, { wait: false }).catch(() => {
        logWarn(
          `Unable to open "${pageUrl}" in browser. If you are running in a headless environment, please do not use the --open flag.`,
        );
      });
    }
  });

  return new Promise<void>(() => {});
}
