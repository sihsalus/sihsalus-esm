import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Force all react/react-dom imports to the root (hoisted) copy to avoid
// "Invalid hook call" errors caused by local node_modules also having react.
const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, '../../..');

export default defineConfig({
  resolve: {
    alias: {
      react: resolve(root, 'node_modules/react/index.js'),
      'react-dom/client': resolve(root, 'node_modules/react-dom/client.js'),
      'react-dom': resolve(root, 'node_modules/react-dom/index.js'),
      swr: resolve(root, 'node_modules/swr'),
    },
    dedupe: ['react', 'react-dom', 'swr'],
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
