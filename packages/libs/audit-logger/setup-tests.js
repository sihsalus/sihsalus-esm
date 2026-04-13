import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
afterEach(cleanup);
/**
 * Expose addEventListener / removeEventListener as own, writable, configurable
 * properties on globalThis so that vi.spyOn(globalThis, 'addEventListener') works.
 *
 * In happy-dom these methods live on EventTarget.prototype — not as own properties
 * of the global object — which Vitest 4 requires for vi.spyOn to succeed.
 * We bind to globalThis first to avoid infinite recursion when the spy fires.
 */
const _win = globalThis;
const _boundAdd = _win.addEventListener.bind(_win);
const _boundRemove = _win.removeEventListener.bind(_win);
Object.defineProperty(_win, 'addEventListener', { value: _boundAdd, writable: true, configurable: true });
Object.defineProperty(_win, 'removeEventListener', { value: _boundRemove, writable: true, configurable: true });
//# sourceMappingURL=setup-tests.js.map