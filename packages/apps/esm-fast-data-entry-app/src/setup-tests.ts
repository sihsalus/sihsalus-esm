import '@testing-library/jest-dom';

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
  (global as typeof globalThis & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver = ResizeObserver;
}
