import path from 'node:path';

import { defineConfig, mergeConfig } from 'vitest/config';

import aliasPresets from './alias-presets.json';
import sharedTestAliases from './shared-test-aliases.json';
import { createVitestAliases } from './vitest-aliases';

const repositoryRoot = path.resolve(__dirname, '../../..');

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
        resolve: {
          alias: createVitestAliases(repositoryRoot, sharedTestAliases),
        },
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
          ...Object.fromEntries(Object.entries(sharedTestAliases).map(([key, value]) => [key, `../../${value}`])),
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
