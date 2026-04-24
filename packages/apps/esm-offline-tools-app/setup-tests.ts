import { cleanup } from '@testing-library/react';

afterEach(cleanup);

jest.mock('workbox-window', () => ({
  Workbox: jest.fn(),
}));

declare global {
  interface Window {
    openmrsBase: string;
    spaBase: string;
    getOpenmrsSpaBase: () => string;
  }
}

const { getComputedStyle } = window;
window.getComputedStyle = (element) => getComputedStyle(element);
window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
window.HTMLElement.prototype.scrollIntoView = jest.fn();
