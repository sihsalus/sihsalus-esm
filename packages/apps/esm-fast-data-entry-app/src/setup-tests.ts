import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  (global as typeof globalThis & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver = ResizeObserver;
}
