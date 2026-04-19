import { defineConfig, mergeConfig, type UserConfig } from 'vitest/config';

import { createVitestAliases } from './vitest-aliases';
import sharedTestAliases from './shared-test-aliases.json';

type AliasMap = Record<string, string>;

export function defineWorkspaceVitestConfig(config: UserConfig = {}) {
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

export function defineAppVitestConfig(
  rootDir: string,
  options: {
    aliases?: AliasMap;
    extraAliases?: Array<{ find: RegExp; replacement: string }>;
    test?: UserConfig['test'];
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
