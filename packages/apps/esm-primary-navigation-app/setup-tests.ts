import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = vi.fn(() => '/openmrs/spa/');

afterEach(cleanup);

vi.mock('workbox-window', () => ({
  Workbox: vi.fn(),
}));
