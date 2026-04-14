import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@openmrs/esm-framework': path.resolve(__dirname, './__mocks__/esm-framework.tsx'),
      '@openmrs/esm-framework/src/internal': path.resolve(__dirname, './__mocks__/esm-framework-internal.tsx'),
    },
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    globals: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
