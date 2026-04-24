import type {} from '@openmrs/esm-framework';
import { cleanup } from '@testing-library/react';

jest.mock('@openmrs/esm-framework', () => require('@openmrs/esm-framework/mock'));

(window as unknown as { importMapOverrides: unknown }).importMapOverrides = {
  getOverrideMap: jest.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);

jest.mock('workbox-window', () => ({
  Workbox: jest.fn(),
}));
