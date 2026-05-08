declare module 'webpack-bundle-analyzer' {
  import type { Plugin } from '@rspack/core';

  export class BundleAnalyzerPlugin extends Plugin {
    constructor(options?: { analyzerMode?: 'server' | 'disabled' });
  }
}

declare module 'webpack-stats-plugin' {
  import type { Plugin } from '@rspack/core';

  export class StatsWriterPlugin extends Plugin {
    constructor(options?: { filename?: string; stats?: Record<string, unknown> });
  }
}
