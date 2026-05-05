import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import type { ImportMapOverridesApi } from './src/devtools/import-map-overrides.types';

// Node.js v25+ provides a broken native localStorage (missing methods unless --localstorage-file is set).
// This shadows happy-dom's working implementation, so we restore a complete in-memory shim.
if (typeof localStorage.clear !== 'function') {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, String(v)),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
      get length() {
        return store.size;
      },
      key: (i: number) => [...store.keys()][i] ?? null,
    },
    writable: true,
    configurable: true,
  });
}

const emptyMap = { imports: {} };

window.importMapOverrides = {
  getOverrideMap: jest.fn().mockReturnValue(emptyMap),
  getNextPageMap: jest.fn().mockResolvedValue(emptyMap),
  getCurrentPageMap: jest.fn().mockResolvedValue(emptyMap),
  getDefaultMap: jest.fn().mockResolvedValue(emptyMap),
  getDisabledOverrides: jest.fn().mockReturnValue([]),
  isDisabled: jest.fn().mockReturnValue(false),
  enableOverride: jest.fn(),
  addOverride: jest.fn(),
  removeOverride: jest.fn(),
  resetOverrides: jest.fn(),
} as unknown as ImportMapOverridesApi;

afterEach(cleanup);

jest.mock('workbox-window', () => ({
  Workbox: jest.fn(),
}));
