import { createGlobalStore, getGlobalStore } from '@openmrs/esm-framework';
import { useEffect, useState } from 'react';

import type { FormState } from '../types';

const STORE_NAME = 'ampath-form-state';

type FormStateStore = Record<string, FormState>;

let initialized = false;

function getStore() {
  if (!initialized) {
    createGlobalStore<FormStateStore>(STORE_NAME, {});
    initialized = true;
  }
  return getGlobalStore<FormStateStore>(STORE_NAME);
}

export function setFormState(formUuid: string, state: FormState) {
  const store = getStore();
  store.setState({ [formUuid]: state });
}

export function getFormState(formUuid: string): FormState {
  const store = getStore();
  return store.getState()[formUuid] ?? 'initial';
}

/**
 * Hook to track and update form state in the global ampath-form-state store.
 */
export function useFormStateTracking(formUuid: string) {
  const [state, setState] = useState<FormState>(() => getFormState(formUuid));

  useEffect(() => {
    const store = getStore();
    const unsubscribe = store.subscribe((newState) => {
      const formState = newState[formUuid] ?? 'initial';
      setState(formState);
    });
    return unsubscribe;
  }, [formUuid]);

  return state;
}
