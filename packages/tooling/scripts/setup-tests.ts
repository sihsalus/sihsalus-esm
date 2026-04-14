import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

jest.mock('single-spa', () => ({
  navigateToUrl: jest.fn(),
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
window.URL.createObjectURL = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLFormElement.prototype.requestSubmit = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
