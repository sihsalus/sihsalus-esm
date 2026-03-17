import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { logInfo, logWarn } from '../utils';

/* eslint-disable no-console */

export interface StartArgs {
  port: number;
  host: string;
  open: boolean;
  backend: string;
  addCookie: string;
}

export function runStart(args: StartArgs) {
  const { backend, host, port, open, addCookie } = args;
  const app = express();
  const shellDist = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..', 'dist');
  const spaDist = resolve(process.cwd(), 'dist', 'spa');
  const spaPath = '/openmrs/spa';
  const pageUrl = `http://${host}:${port}${spaPath}`;

  // Rewrite index.html to use local importmap and routes instead of dev3.openmrs.org
  const indexContent = readFileSync(resolve(shellDist, 'index.html'), 'utf8')
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa\/importmap\.json/g, `${spaPath}/importmap.json`)
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa/g, spaPath)
    .replace(/href="\/openmrs\/spa/g, `href="${spaPath}`)
    .replace(/src="\/openmrs\/spa/g, `src="${spaPath}`);

  // Serve rewritten index.html for SPA routes (before static assets)
  const indexHtmlPathMatcher = /\/openmrs\/spa\/(?!.*\.(js|woff2?|json|css|.{2,3}$)).*$/;
  app.get(indexHtmlPathMatcher, (_, res) => res.contentType('text/html').send(indexContent));

  // Serve static assets: dist/spa first (assembled app bundles), then shell dist as fallback
  if (existsSync(spaDist)) {
    app.use(spaPath, express.static(spaDist, { index: false }));
    logInfo(`Serving assembled SPA from ${spaDist}`);
  }
  app.use(spaPath, express.static(shellDist, { index: false }));

  // Proxy all /openmrs/* API requests to the backend
  app.use(
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
  app.get('/*', (_, res) => res.contentType('text/html').send(indexContent));

  app.listen(port, host, () => {
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
