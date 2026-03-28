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
  // Also disable offline/service-worker to prevent stale caches during local dev.
  const indexContent = readFileSync(resolve(shellDist, 'index.html'), 'utf8')
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa\/importmap\.json/g, `${spaPath}/importmap.json`)
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa/g, spaPath)
    .replace(/href="\/openmrs\/spa/g, `href="${spaPath}`)
    .replace(/src="\/openmrs\/spa/g, `src="${spaPath}`)
    .replace(/offline:\s*true/g, 'offline: false');

  // Build merged importmap: all local modules take precedence over backend.
  // Now that the app-shell is built locally with rspack (same MF runtime as apps),
  // all modules are compatible and can be served locally.
  let localImportmap: { imports: Record<string, string> } = { imports: {} };
  const importmapPath = resolve(spaDist, 'importmap.json');
  if (existsSync(importmapPath)) {
    localImportmap = JSON.parse(readFileSync(importmapPath, 'utf8'));
  }

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

  // Backend modules that map to local modules with different names.
  // e.g. backend "esm-patient-immunizations-app" is replaced by local "esm-vacunacion-app"
  const backendAliases: Record<string, string> = {
    'esm-indicators-app': 'esm-indicadores-app',
    'esm-patient-immunizations-app': 'esm-vacunacion-app',
  };
  for (const [backendName, localName] of Object.entries(backendAliases)) {
    if (localBaseNames.has(localName)) localBaseNames.add(backendName);
  }

  if (backendImportmap?.imports) {
    let skippedCount = 0;
    let addedCount = 0;
    for (const [name, url] of Object.entries(backendImportmap.imports)) {
      const baseName = name.replace(/^@[^/]+\//, '');
      if (localBaseNames.has(baseName)) {
        skippedCount++;
        continue;
      }

      // If the module was downloaded during assembly, it's already in the local
      // importmap with a relative path. Only add backend modules that exist locally;
      // skip modules whose bundles weren't successfully downloaded (e.g. 404 on backend).
      if (localImportmap.imports[name]) {
        addedCount++;
        continue; // already in local importmap, will be added below
      }

      // Check if the bundle was downloaded to dist/spa during assembly
      const cleanRelUrl = url.replace(/^\.\//, '');
      const localPath = resolve(spaDist, cleanRelUrl);
      if (existsSync(localPath)) {
        mergedImportmap.imports[name] = `./${cleanRelUrl}`;
        addedCount++;
      } else {
        skippedCount++;
        logWarn(`  Skip ${name}: not available locally`);
      }
    }
    logInfo(`Backend importmap: ${Object.keys(backendImportmap.imports).length} modules (${addedCount} available, ${skippedCount} skipped)`);
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

  // Serve static assets: dist/spa first (assembled app bundles), then shell dist as fallback
  if (existsSync(spaDist)) {
    expressApp.use(spaPath, express.static(spaDist, { index: false }));
    logInfo(`Serving assembled SPA from ${spaDist}`);
  }
  expressApp.use(spaPath, express.static(shellDist, { index: false }));

  // Proxy all /openmrs/* API requests to the backend (except /openmrs/spa/**)
  expressApp.use(
    createProxyMiddleware(
      (path) => path.startsWith('/openmrs') && !path.startsWith(spaPath),
      {
        target: backend,
        changeOrigin: true,
        onProxyReq(proxyReq) {
          if (addCookie) {
            const origCookie = proxyReq.getHeader('cookie');
            const newCookie = `${origCookie};${addCookie}`;
            proxyReq.setHeader('cookie', newCookie);
          }
        },
        onProxyRes(proxyRes) {
          // Remove CSP headers from backend — they block browser requests
          // when serving from localhost (the backend's CSP allowlist doesn't
          // include all the origins the local dev server needs).
          if (proxyRes.headers) {
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];
          }
        },
      },
    ),
  );

  // Fallback: serve index.html for any unmatched route (SPA client-side routing)
  expressApp.get('/*', (_, res) => res.contentType('text/html').send(indexContent));

  // Bind to 0.0.0.0 to listen on both IPv4 and IPv6, avoiding issues where
  // "localhost" resolves to only ::1 (IPv6) but the browser tries 127.0.0.1 first.
  const listenHost = host === 'localhost' ? '0.0.0.0' : host;
  expressApp.listen(port, listenHost, () => {
    logInfo(`Listening at http://localhost:${port}`);
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
