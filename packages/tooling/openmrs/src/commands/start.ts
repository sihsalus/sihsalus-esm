import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

  // Build merged importmap: local modules take precedence, backend fills gaps
  let localImportmap: { imports: Record<string, string> } = { imports: {} };
  const importmapPath = resolve(spaDist, 'importmap.json');
  if (existsSync(importmapPath)) {
    localImportmap = JSON.parse(readFileSync(importmapPath, 'utf8'));
  }

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
    // Add backend modules first (as base), skipping duplicates
    for (const [name, url] of Object.entries(backendImportmap.imports)) {
      const baseName = name.replace(/^@[^/]+\//, '');
      if (localBaseNames.has(baseName)) {
        skippedCount++;
        continue;
      }
      // Resolve relative URLs against the backend
      const resolvedUrl = url.startsWith('.') ? `${backendUrl}/openmrs/spa/${url.replace(/^\.\//, '')}` : url;
      mergedImportmap.imports[name] = resolvedUrl;
    }
    logInfo(`Backend importmap: ${Object.keys(backendImportmap.imports).length} modules (${skippedCount} skipped as duplicates)`);
  } else {
    logWarn(`Could not fetch backend importmap — using local modules only`);
  }

  // Override with local modules (local takes precedence)
  for (const [name, url] of Object.entries(localImportmap.imports)) {
    mergedImportmap.imports[name] = url;
  }

  const localCount = Object.keys(localImportmap.imports).length;
  const totalCount = Object.keys(mergedImportmap.imports).length;
  const backendOnlyCount = totalCount - localCount;
  logInfo(`Merged importmap: ${localCount} local + ${backendOnlyCount} from backend = ${totalCount} total`);

  // Build merged routes: same strategy
  let localRoutes: Record<string, unknown> = {};
  const routesPath = resolve(spaDist, 'routes.registry.json');
  if (existsSync(routesPath)) {
    localRoutes = JSON.parse(readFileSync(routesPath, 'utf8'));
  }

  const backendRoutes = (await fetchBackendJson(`${backendUrl}/openmrs/spa/routes.registry.json`)) as Record<
    string,
    unknown
  > | null;

  const mergedRoutes: Record<string, unknown> = {};
  if (backendRoutes) {
    Object.assign(mergedRoutes, backendRoutes);
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

  // Serve static assets: dist/spa first (assembled app bundles), then shell dist as fallback
  if (existsSync(spaDist)) {
    expressApp.use(spaPath, express.static(spaDist, { index: false }));
    logInfo(`Serving assembled SPA from ${spaDist}`);
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
