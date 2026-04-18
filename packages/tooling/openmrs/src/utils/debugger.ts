import { dirname } from 'node:path';

import {
  rspack,
  type Configuration as RspackConfiguration,
  type DevServer as RspackDevServerConfiguration,
} from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';

import { logInfo } from './logger';

function getWebpackEnv() {
  return {
    ...process.env,
    analyze: process.env.BUNDLE_ANALYZE === 'true',
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development',
  };
}

function loadConfig(configPath: string): RspackConfiguration {
   
  const content: RspackConfiguration | ((env: Record<string, unknown>) => RspackConfiguration) = require(configPath);
  if (typeof content === 'function') {
    return content(getWebpackEnv());
  }
  return content;
}

function startDevServer(configPath: string, port: number) {
  const config = loadConfig(configPath);

  const devServerOptions = {
    ...config.devServer,
    port,
    static: dirname(configPath),
  };

  const compiler = rspack(config);
  const server = new RspackDevServer(devServerOptions as RspackDevServerConfiguration, compiler);

  server.startCallback(() => {
    logInfo(`Listening at http://localhost:${port}`);
  });
}

process.on('message', ({ source, port }: { source: string; port: number }) => startDevServer(source, port));
