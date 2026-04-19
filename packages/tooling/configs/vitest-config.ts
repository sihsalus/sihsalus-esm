import { defineConfig, mergeConfig, type UserConfig } from 'vitest/config';

import { createVitestAliases } from './vitest-aliases';

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
      alias: [...extraAliases, ...createVitestAliases(rootDir, aliases)],
    },
    test: {
      setupFiles: ['./setup-tests.ts'],
      ...test,
    },
  });
}
