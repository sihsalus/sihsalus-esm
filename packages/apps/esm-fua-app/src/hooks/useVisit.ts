import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface VisitPatientInfo {
  display: string;
  identifiers: Array<{
    identifier: string;
    identifierType: { display: string };
  }>;
}

const preferredIdentifierNames = ['DNI', 'CE', 'Pasaporte', 'PASS', 'DIE', 'CNV', 'N° Historia Clínica'];

export function useVisit(visitUuid: string | null | undefined) {
  const url = visitUuid
    ? `${restBaseUrl}/visit/${visitUuid}?v=custom:(patient:(display,identifiers:(identifier,identifierType:(display))))`
    : null;

  const { data, error, isLoading } = useSWR<{ data: { patient: VisitPatientInfo } }>(url, openmrsFetch);

  const patient = data?.data?.patient ?? null;
  const patientIdentifier =
    preferredIdentifierNames
      .map((identifierName) =>
        patient?.identifiers?.find((id) => id.identifierType?.display?.toLowerCase() === identifierName.toLowerCase()),
      )
      .find(Boolean)?.identifier ??
    patient?.identifiers?.[0]?.identifier ??
    null;

  return { patient, patientIdentifier, dni: patientIdentifier, isLoading, error };
}
