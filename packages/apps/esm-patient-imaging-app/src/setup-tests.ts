import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as any;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as any;
}

// Polyfill ResizeObserver
class ResizeObserver {
  observe() {
    // Test environment no-op.
  }
  unobserve() {
    // Test environment no-op.
  }
  disconnect() {
    // Test environment no-op.
  }
}

if (!global.ResizeObserver) {
  (global as any).ResizeObserver = ResizeObserver;
}
