import type {} from '@openmrs/esm-framework';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('@openmrs/esm-framework', () => import('@openmrs/esm-framework/mock'));

(window as unknown as { importMapOverrides: unknown }).importMapOverrides = {
  getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);

vi.mock('workbox-window', () => ({
  Workbox: vi.fn(),
}));
