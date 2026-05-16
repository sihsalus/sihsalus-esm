import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { vi } from 'vitest';

vi.mock('single-spa', () => ({
  navigateToUrl: vi.fn(),
}));

declare global {
  interface Window {
    openmrsBase: string;
    spaBase: string;
  }
}

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';

// Ensure i18next locale is available for components that call getLocale()
// (e.g. Carbon DatePicker via @openmrs/esm-styleguide) before the framework mock loads.
globalThis.i18next = { ...globalThis.i18next, language: 'en' } as unknown;
globalThis.TextEncoder = globalThis.TextEncoder ?? TextEncoder;
globalThis.TextDecoder = globalThis.TextDecoder ?? TextDecoder;
window.URL.createObjectURL = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLFormElement.prototype.requestSubmit = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
