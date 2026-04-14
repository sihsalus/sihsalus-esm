import React from 'react';
import { vi } from 'vitest';

export type FetchResponse<T = unknown> = {
  data?: T;
  status?: number;
  ok?: boolean;
};

export const openmrsFetch = vi.fn();
export const refetchCurrentUser = vi.fn();
export const clearCurrentUser = vi.fn();
export const setSessionLocation = vi.fn();
export const setUserProperties = vi.fn();
export const setUserLanguage = vi.fn();
export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';
export const useDebounce = vi.fn((value: unknown) => value);
export const getSessionStore = vi.fn(() => ({
  getState: vi.fn(() => ({ loaded: true, session: { authenticated: false } })),
  setState: vi.fn(),
  getInitialState: vi.fn(),
  subscribe: vi.fn(),
  destroy: vi.fn(),
}));
export const navigate = vi.fn();
export const clearHistory = vi.fn();
export const showSnackbar = vi.fn();
export const showModal = vi.fn();
export const showNotification = vi.fn();
export const getCoreTranslation = vi.fn((key: string) => key);
export const interpolateUrl = vi.fn((url: string) => url);

export const useConfig = vi.fn(() => ({
  provider: { type: 'basic' },
  chooseLocation: { enabled: true, useLoginLocationTag: true },
  links: { loginSuccess: '/home' },
  showPasswordOnSeparateScreen: true,
}));

export const useConnectivity = vi.fn(() => true);
export const useSession = vi.fn(() => ({ authenticated: false, user: null, sessionLocation: null }));

export const ArrowRightIcon = () => <span />;
export const LocationIcon = () => <span />;
export const PasswordIcon = () => <span />;

export const LocationPicker = ({ onChange }: { onChange?: (uuid: string) => void }) => (
  <div>
    <button type="button" role="radio" aria-checked="false" onClick={() => onChange?.('uuid_1')}>
      location_1
    </button>
    <button type="button" role="radio" aria-checked="false" onClick={() => onChange?.('uuid_2')}>
      location_2
    </button>
  </div>
);

export const useLayoutType = vi.fn(() => 'desktop');
export const useFeatureFlag = vi.fn(() => true);
export const usePagination = vi.fn((items: unknown[] = []) => ({ results: items, currentPage: 1, goTo: vi.fn() }));
