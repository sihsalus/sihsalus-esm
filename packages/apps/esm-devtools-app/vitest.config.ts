import { defineConfig } from 'vitest/config';

export default defineConfig({
  ssr: {
    noExternal: ['workbox-window', 'workbox-core'],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
