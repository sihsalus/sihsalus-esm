import path from 'node:path';

import { defineConfig, mergeConfig } from 'vitest/config';

import aliasPresets from './alias-presets.json';
import sharedTestAliases from './shared-test-aliases.json';
import { createVitestAliases } from './vitest-aliases';

const packagesRoot = path.resolve(__dirname, '../..');

const sharedWorkspaceTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([key, value]) => [key, `./${value}`]),
);

const sharedAppTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([key, value]) => [key, `../../${value}`]),
);

type TestOptions = {
  setupFiles?: string | string[];
  [key: string]: unknown;
};

type AliasMap = Record<string, string>;
type VitestConfigLike = {
  resolve?: {
    alias?: Array<{ find: RegExp; replacement: string }>;
  };
  test?: TestOptions;
  [key: string]: unknown;
};

function normalizeSetupFiles(setupFiles?: TestOptions['setupFiles']) {
  if (setupFiles === undefined) {
    return ['./setup-tests.ts'];
  }

  return Array.isArray(setupFiles) ? ['./setup-tests.ts', ...setupFiles] : ['./setup-tests.ts', setupFiles];
}

export function defineWorkspaceVitestConfig(config: VitestConfigLike = {}) {
  return defineConfig(
    mergeConfig(
      {
        resolve: {
          alias: createVitestAliases(packagesRoot, sharedWorkspaceTestAliases),
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
  const { setupFiles, ...restTest } = test;

  return defineWorkspaceVitestConfig({
    resolve: {
      alias: [
        ...extraAliases,
        ...createVitestAliases(rootDir, {
          ...sharedAppTestAliases,
          ...aliases,
        }),
      ],
    },
    test: {
      ...restTest,
      setupFiles: normalizeSetupFiles(setupFiles),
    },
  });
}
