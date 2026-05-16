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
function normalizeSetupFiles(setupFiles) {
  if (setupFiles === undefined) {
    return ['./setup-tests.ts'];
  }
  return Array.isArray(setupFiles) ? ['./setup-tests.ts', ...setupFiles] : ['./setup-tests.ts', setupFiles];
}
export function defineWorkspaceVitestConfig(config = {}) {
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
export function defineAppVitestConfig(rootDir, options = {}) {
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
//# sourceMappingURL=vitest-config.js.map
