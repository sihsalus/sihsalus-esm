import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('workbox-window', () => ({
  Workbox: class {
    register() { return Promise.resolve(); }
    addEventListener() {}
    messageSW() { return Promise.resolve(); }
  },
  messageSW: () => Promise.resolve(),
}));

(window as any).importMapOverrides = {
  getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);
