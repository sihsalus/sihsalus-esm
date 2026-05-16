import path from 'node:path';

import { defineConfig, mergeConfig } from 'vitest/config';

import aliasPresets from './alias-presets.json';
import sharedTestAliases from './shared-test-aliases.json';
import { createVitestAliases } from './vitest-aliases';

const packagesRoot = path.resolve(__dirname, '../..');
const sharedSetupFile = path.resolve(__dirname, '../scripts/setup-tests.ts');

const sharedWorkspaceTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([key, value]) => [key, `./${value}`]),
);

const sharedAppTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([key, value]) => [key, `../../${value}`]),
);

const appBaseAliases: Record<string, string> = {
  '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
  '@openmrs/esm-translations': '@openmrs/esm-translations/mock',
  '@openmrs/esm-api': path.resolve(packagesRoot, 'libs/esm-api/src/index.ts'),
  '@openmrs/esm-api/mock': path.resolve(packagesRoot, 'libs/esm-api/mock-jest.ts'),
  '@openmrs/esm-utils': path.resolve(packagesRoot, 'libs/esm-utils/src/index.ts'),
  '@openmrs/esm-utils/mock': path.resolve(packagesRoot, 'libs/esm-utils/mock-jest.ts'),
};

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

function normalizeWorkspaceSetupFiles(setupFiles?: TestOptions['setupFiles']) {
  if (setupFiles === undefined) {
    return ['./setup-tests.ts'];
  }
  return Array.isArray(setupFiles) ? ['./setup-tests.ts', ...setupFiles] : ['./setup-tests.ts', setupFiles];
}

function normalizeAppSetupFiles(setupFiles?: TestOptions['setupFiles']) {
  if (setupFiles === undefined) {
    return [sharedSetupFile];
  }
  return Array.isArray(setupFiles) ? [sharedSetupFile, ...setupFiles] : [sharedSetupFile, setupFiles];
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
          ...appBaseAliases,
          ...aliases,
        }),
      ],
    },
    test: {
      ...restTest,
      setupFiles: normalizeAppSetupFiles(setupFiles),
    },
  });
}

export function defineWorkspaceVitestConfigWithSetup(config: VitestConfigLike = {}) {
  const { test = {}, ...rest } = config;
  const { setupFiles, ...restTest } = test as TestOptions;
  return defineWorkspaceVitestConfig({
    ...rest,
    test: {
      ...restTest,
      setupFiles: normalizeWorkspaceSetupFiles(setupFiles),
    },
  });
}
