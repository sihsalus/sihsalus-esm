import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as any;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as any;
}

// Polyfill ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  (global as any).ResizeObserver = ResizeObserver;
}
