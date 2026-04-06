import { openmrsFetch } from '@openmrs/esm-framework';
import { renderHook, waitFor } from '@testing-library/react';

import useFormSchema from './useFormSchema';

jest.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: jest.fn(),
  restBaseUrl: '/ws/rest/v1',
}));

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

import useSWR from 'swr';

const mockUseSWR = jest.mocked(useSWR);

describe('useFormSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.schema).toBeUndefined();
  });

  it('returns schema with encounterType UUID extracted', () => {
    mockUseSWR.mockReturnValue({
      data: {
        data: {
          uuid: 'form-uuid',
          name: 'Test Form',
          encounterType: { uuid: 'enc-type-uuid', display: 'Visit Note' },
          pages: [],
        },
      },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.schema).toBeDefined();
    expect(result.current.schema.encounterType).toBe('enc-type-uuid');
  });

  it('returns error on fetch failure', () => {
    const testError = new Error('Network error');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: testError,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    const { result } = renderHook(() => useFormSchema('form-uuid'));
    expect(result.current.error).toBe(testError);
  });

  it('passes null URL when formUuid is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as any);

    renderHook(() => useFormSchema(''));
    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });
});
