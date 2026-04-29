import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

import { ModuleFuaRestURL } from '../constant';

export interface VisitSummary {
  uuid?: string;
  patient?: {
    person?: {
      names?: Array<{
        display?: string;
      }>;
    };
  };
  location?: {
    display?: string;
  };
  startDatetime?: string;
}

export interface VisitPatientInfo {
  display: string;
  identifiers: Array<{
    identifier: string;
    identifierType: { display: string };
  }>;
}

export function useVisit(visitUuid: string | null | undefined) {
  const url = visitUuid
    ? `${restBaseUrl}/visit/${visitUuid}?v=custom:(patient:(display,identifiers:(identifier,identifierType:(display))))`
    : null;

  const { data, error, isLoading } = useSWR<{ data: { patient: VisitPatientInfo } }>(url, openmrsFetch);

  const patient = data?.data?.patient ?? null;
  // Prefer DNI/Documento Nacional de Identidad; fallback to first identifier
  const dni =
    patient?.identifiers?.find(
      (id) =>
        id.identifierType?.display?.toLowerCase().includes('dni') ||
        id.identifierType?.display?.toLowerCase().includes('national'),
    )?.identifier ??
    patient?.identifiers?.[0]?.identifier ??
    null;

  return { patient, dni, isLoading, error };
}

export function useVisits() {
  const url = `${restBaseUrl}/visit?v=custom:(uuid,patient:(person:(names:(display))),location:(display),startDatetime)`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<VisitSummary> } }>(
    url,
    openmrsFetch,
  );

  return {
    visits: data?.data?.results ?? [],
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

export function generateFuaFromVisit(visitUuid: string) {
  return openmrsFetch(`${ModuleFuaRestURL}/generateFromVisit/${visitUuid}`, {
    method: 'POST',
  });
}
