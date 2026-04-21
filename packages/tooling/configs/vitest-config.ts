import { defineConfig, mergeConfig } from 'vitest/config';

import aliasPresets from './alias-presets.json';
import { createVitestAliases } from './vitest-aliases';
import sharedTestAliases from './shared-test-aliases.json';

type AliasMap = Record<string, string>;
type VitestConfigLike = {
  resolve?: {
    alias?: Array<{ find: RegExp; replacement: string }>;
  };
  test?: Record<string, unknown>;
  [key: string]: unknown;
};

export function defineWorkspaceVitestConfig(config: VitestConfigLike = {}) {
  return defineConfig(
    mergeConfig(
      {
        test: {
          environment: 'happy-dom',
          mockReset: true,
          globals: true,
        },
      },
      config,
    ),
  );
}

export { aliasPresets };

export function defineAppVitestConfig(
  rootDir: string,
  options: {
    aliases?: AliasMap;
    extraAliases?: Array<{ find: RegExp; replacement: string }>;
    test?: VitestConfigLike['test'];
  } = {},
) {
  const { aliases = {}, extraAliases = [], test = {} } = options;

  return defineWorkspaceVitestConfig({
    resolve: {
      alias: [
        ...extraAliases,
        ...createVitestAliases(rootDir, {
          ...Object.fromEntries(
            Object.entries(sharedTestAliases).map(([key, value]) => [key, `../../${value}`]),
          ),
          ...aliases,
        }),
      ],
    },
    test: {
      setupFiles: ['./setup-tests.ts'],
      ...test,
    },
  });
}
