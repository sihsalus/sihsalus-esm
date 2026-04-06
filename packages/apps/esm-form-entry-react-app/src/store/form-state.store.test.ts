import { setFormState, getFormState } from './form-state.store';

jest.mock('@openmrs/esm-framework', () => {
  const stores: Record<string, any> = {};
  return {
    createGlobalStore: jest.fn((name, initialState) => {
      let state = { ...initialState };
      const subscribers: Array<(state: any) => void> = [];
      stores[name] = {
        getState: () => state,
        setState: (partial: any) => {
          state = { ...state, ...partial };
          subscribers.forEach((fn) => fn(state));
        },
        subscribe: (fn: (state: any) => void) => {
          subscribers.push(fn);
          return () => {
            const idx = subscribers.indexOf(fn);
            if (idx >= 0) subscribers.splice(idx, 1);
          };
        },
      };
      return stores[name];
    }),
    getGlobalStore: jest.fn((name) => stores[name]),
  };
});

describe('form-state.store', () => {
  it('defaults to initial state', () => {
    expect(getFormState('unknown-form')).toBe('initial');
  });

  it('sets and gets form state', () => {
    setFormState('form-1', 'loading');
    expect(getFormState('form-1')).toBe('loading');

    setFormState('form-1', 'ready');
    expect(getFormState('form-1')).toBe('ready');
  });

  it('tracks multiple forms independently', () => {
    setFormState('form-a', 'submitting');
    setFormState('form-b', 'submitted');
    expect(getFormState('form-a')).toBe('submitting');
    expect(getFormState('form-b')).toBe('submitted');
  });
});
