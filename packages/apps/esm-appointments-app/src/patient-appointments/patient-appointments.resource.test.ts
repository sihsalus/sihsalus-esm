import { renderHook } from '@testing-library/react';
import useSWR from 'swr';
import { useAppointments } from '../form/appointments-form.resource';
import { usePatientAppointments } from './patient-appointments.resource';

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
    useSWRConfig: jest.fn(() => ({ mutate: jest.fn() })),
  };
});

const mockUseSWR = jest.mocked(useSWR);

describe('appointment resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty appointment buckets when the patient appointments response has no data array', () => {
    mockUseSWR.mockReturnValue({
      data: { data: null },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as never);

    const { result } = renderHook(() => usePatientAppointments('patient-uuid', '2026-04-17', new AbortController()));

    expect(result.current.data).toEqual({
      pastAppointments: [],
      upcomingAppointments: [],
      todaysAppointments: [],
    });
  });

  it('returns empty appointment buckets when the form appointments response has no data array', () => {
    mockUseSWR.mockReturnValue({
      data: { data: null },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    } as never);

    const { result } = renderHook(() => useAppointments('patient-uuid', '2026-04-17', new AbortController()));

    expect(result.current.data).toEqual({
      pastAppointments: [],
      upcomingAppointments: [],
      todaysAppointments: [],
    });
  });
});
