/**
 * Vitest setup: ensure globalThis.addEventListener is an own, configurable property
 * so that vi.spyOn(globalThis, 'addEventListener') works in jsdom.
 *
 * In jsdom the method lives on EventTarget.prototype, not on the window object
 * itself, which makes it invisible to vi.spyOn's property lookup.
 */
if (typeof globalThis.addEventListener === 'function') {
  const original = globalThis.addEventListener.bind(globalThis);
  Object.defineProperty(globalThis, 'addEventListener', {
    value: original,
    writable: true,
    configurable: true,
  });
}
if (typeof globalThis.removeEventListener === 'function') {
  const original = globalThis.removeEventListener.bind(globalThis);
  Object.defineProperty(globalThis, 'removeEventListener', {
    value: original,
    writable: true,
    configurable: true,
  });
}
