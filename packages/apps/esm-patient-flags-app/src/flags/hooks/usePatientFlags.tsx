import { openmrsFetch, restBaseUrl, type FetchResponse } from '@openmrs/esm-framework';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

interface FlagFetchResponse {
  uuid: string;
  message: string;
  voided: boolean;
  flag: { uuid: string; display: string };
  patient: { uuid: string; display: string };
  tags: Array<{ uuid: string; display: string }>;
  auditInfo: { dateCreated: string };
}

export type PatientFlag = FlagFetchResponse;

export interface PatientFlagsResult {
  flags: Array<PatientFlag>;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<FetchResponse<FlagsFetchResponse> | undefined>;
}

interface FlagsFetchResponse {
  results: Array<FlagFetchResponse>;
}

/**
 * React hook that takes in a patient uuid and returns
 * patient flags for that patient together with helper objects
 * @param patientUuid Unique patient idenfier
 * @returns An array of patient identifiers
 */
export function usePatientFlags(patientUuid: string): PatientFlagsResult {
  const url = `${restBaseUrl}/patientflags/patientflag?patient=${patientUuid}&v=full`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<FetchResponse<FlagsFetchResponse>, Error>(
    patientUuid ? url : null,
    openmrsFetch,
  );

  const result: PatientFlagsResult = {
    flags: data?.data?.results ?? [],
    error: error,
    isLoading: isLoading,
    isValidating: isValidating,
    mutate: () => mutate(),
  };

  return result;
}

export function useCurrentPath(): string {
  const [path, setPath] = useState(globalThis.location.pathname);

  const listenToRoutingEvent = useCallback(
    (e: Event) => {
      const winPath = (e as CustomEvent<{ newUrl: string }>).detail.newUrl;
      setPath(winPath);
    },
    [setPath],
  );

  useEffect(() => {
    globalThis.addEventListener('single-spa:routing-event', listenToRoutingEvent);
    return () => {
      globalThis.removeEventListener('single-spa:routing-event', listenToRoutingEvent);
    };
  }, [listenToRoutingEvent]);

  return path;
}

export function enablePatientFlag(flagUuid: string) {
  const controller = new AbortController();
  const url = `${restBaseUrl}/patientflags/patientflag/${flagUuid}`;

  return openmrsFetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: { deleted: 'false' },
    signal: controller.signal,
  });
}

export function disablePatientFlag(flagUuid: string) {
  const controller = new AbortController();
  const url = `${restBaseUrl}/patientflags/patientflag/${flagUuid}`;

  return openmrsFetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    signal: controller.signal,
  });
}
