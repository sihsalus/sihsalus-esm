import { cleanup } from '@testing-library/react';

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = jest.fn(() => '/openmrs/spa/');

afterEach(cleanup);

jest.mock('workbox-window', () => ({
  Workbox: jest.fn(),
}));
