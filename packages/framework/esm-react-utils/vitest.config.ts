import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'swr'],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
