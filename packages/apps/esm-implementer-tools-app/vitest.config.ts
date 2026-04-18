import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^lodash-es$/, replacement: 'lodash' },
      { find: /^lodash-es\/(.*)$/, replacement: 'lodash/$1' },
      { find: '@openmrs/esm-framework/src/internal', replacement: '@openmrs/esm-framework/mock' },
      { find: /^@openmrs\/esm-framework$/, replacement: '@openmrs/esm-framework/mock' },
    ],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
    },
  },
});
