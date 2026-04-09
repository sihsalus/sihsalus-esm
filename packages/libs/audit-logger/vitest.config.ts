import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        branches: 80,
      },
    },
  },
});
