// happy-dom v20 doesn't expose localStorage as callable methods; provide an in-memory shim.
const _localStorageData: Record<string, string> = {};
const _localStorageShim: Storage = {
  getItem: (key) => _localStorageData[key] ?? null,
  setItem: (key, value) => { _localStorageData[key] = String(value); },
  removeItem: (key) => { delete _localStorageData[key]; },
  clear: () => { Object.keys(_localStorageData).forEach((k) => delete _localStorageData[k]); },
  get length() { return Object.keys(_localStorageData).length; },
  key: (index) => Object.keys(_localStorageData)[index] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: _localStorageShim, writable: true });
Object.defineProperty(window, 'localStorage', { value: _localStorageShim, writable: true });
