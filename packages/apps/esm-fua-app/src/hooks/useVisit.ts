import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { getPreferredIdentifier } from '@sihsalus/esm-sihsalus-shared';
import useSWR from 'swr';

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
  const patientIdentifier = getPreferredIdentifier(patient?.identifiers ?? [])?.identifier ?? null;

  return { patient, patientIdentifier, dni: patientIdentifier, isLoading, error };
}
