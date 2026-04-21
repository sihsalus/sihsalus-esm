import { defineConfig, mergeConfig } from 'vitest/config';
import aliasPresets from './alias-presets.json';
import { createVitestAliases } from './vitest-aliases';
import sharedTestAliases from './shared-test-aliases.json';
export function defineWorkspaceVitestConfig(config = {}) {
    return defineConfig(mergeConfig({
        test: {
            environment: 'happy-dom',
            mockReset: true,
            globals: true,
        },
    }, config));
}
export { aliasPresets };
export function defineAppVitestConfig(rootDir, options = {}) {
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
//# sourceMappingURL=vitest-config.js.map