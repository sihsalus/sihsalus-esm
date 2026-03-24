import * as matchers from '@testing-library/jest-dom/matchers';
import { afterEach, expect, vi } from 'vitest';
import type {} from '@openmrs/esm-globals';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// happy-dom v20 localStorage shim
const _lsData: Record<string, string> = {};
const _lsShim: Storage = {
  getItem: (key) => _lsData[key] ?? null,
  setItem: (key, value) => { _lsData[key] = String(value); },
  removeItem: (key) => { delete _lsData[key]; },
  clear: () => { Object.keys(_lsData).forEach((k) => delete _lsData[k]); },
  get length() { return Object.keys(_lsData).length; },
  key: (index) => Object.keys(_lsData)[index] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: _lsShim, writable: true });
Object.defineProperty(window, 'localStorage', { value: _lsShim, writable: true });

vi.mock('@openmrs/esm-api', async () => ({
  ...(await vi.importActual('@openmrs/esm-api')),
  ...(await import('@openmrs/esm-api/mock')),
}));
vi.mock('@openmrs/esm-react-utils', () => import('@openmrs/esm-react-utils/mock'));
vi.mock('@openmrs/esm-translations', () => import('@openmrs/esm-translations/mock'));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
window.HTMLElement.prototype.scrollIntoView = vi.fn();

afterEach(cleanup);
afterEach(vi.resetAllMocks);
