import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
    environmentOptions: {
      happyDOM: {
        url: 'http://localhost/',
      },
      jsdom: {
        url: 'http://localhost/',
      },
    },
    mockReset: true,
    setupFiles: ['./setup-tests.ts'],
  },
});
