import { vi } from 'vitest';

import { DownloadIcon, TrashCanIcon, Type, clearHistory, getExtensionInternalStore, useStore } from './esm-framework.mock';

function createMockStore<T>(initialState: T) {
  let state = initialState;
  const subscribers = new Set<(state: T) => void>();

  return {
    getState: vi.fn(() => state),
    setState: vi.fn((update: Partial<T> | T | ((prev: T) => T)) => {
      state = typeof update === 'function' ? update(state) : typeof update === 'object' && update !== null ? ({ ...state, ...update } as T) : state;
      subscribers.forEach((subscriber) => subscriber(state));
    }),
    subscribe: vi.fn((subscriber: (state: T) => void) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    }),
  };
}

export { DownloadIcon, TrashCanIcon, Type, clearHistory, getExtensionInternalStore, useStore };

export const implementerToolsConfigStore = createMockStore({ config: {} as Record<string, unknown> });
export const temporaryConfigStore = createMockStore({ config: {} as Record<string, unknown> });
export const clearConfigErrors = vi.fn();

export const useStoreWithActions = vi.fn((store, actions) => {
  const state = useStore(store);
  const boundActions = Object.fromEntries(
    Object.entries(actions).map(([key, action]) => [
      key,
      () => {
        store.setState((prevState) => ({ ...prevState, ...action(prevState) }));
      },
    ]),
  );

  return {
    ...state,
    ...boundActions,
  };
});
