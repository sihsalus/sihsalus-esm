import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface Identifier {
  identifier?: string;
  identifierType?: {
    display?: string;
  };
}

interface Visit {
  uuid: string;
  startDatetime?: string;
  stopDatetime?: string;
  patient?: {
    uuid?: string;
    display?: string;
    identifiers?: Identifier[];
  };
  visitType?: {
    display?: string;
  };
  location?: {
    display?: string;
  };
}

interface VisitResponse {
  results?: Visit[];
}

export interface AdmissionRow {
  uuid: string;
  startDatetime?: string;
  patientName: string;
  medicalRecordNumber: string;
  service: string;
  location: string;
  status: string;
}

function getMedicalRecordNumber(identifiers: Identifier[] = []) {
  const preferred =
    identifiers.find((identifier) => /historia|clinical|openmrs|hc/i.test(identifier.identifierType?.display ?? '')) ??
    identifiers[0];

  return preferred?.identifier ?? '';
}

function mapVisitToAdmission(visit: Visit): AdmissionRow {
  return {
    uuid: visit.uuid,
    startDatetime: visit.startDatetime,
    patientName: visit.patient?.display ?? '',
    medicalRecordNumber: getMedicalRecordNumber(visit.patient?.identifiers),
    service: visit.visitType?.display ?? '',
    location: visit.location?.display ?? '',
    status: visit.stopDatetime ? 'Finalizada' : 'Activa',
  };
}

const visitRepresentation =
  'custom:(uuid,startDatetime,stopDatetime,patient:(uuid,display,identifiers:(identifier,identifierType:(display))),visitType:(display),location:(display))';

export function useAdmissions(limit: number) {
  const url = `${restBaseUrl}/visit?includeInactive=true&v=${visitRepresentation}&limit=${limit}`;
  const { data, error, isLoading } = useSWR<{ data: VisitResponse }, Error>(url, openmrsFetch);

  return {
    admissions: data?.data.results?.map(mapVisitToAdmission) ?? [],
    error,
    isLoading,
  };
}

export function useActiveVisitSummary(patientUuid?: string) {
  const url = patientUuid
    ? `${restBaseUrl}/visit?patient=${patientUuid}&includeInactive=false&v=${visitRepresentation}&limit=1`
    : null;
  const { data, error, isLoading } = useSWR<{ data: VisitResponse }, Error>(url, openmrsFetch);
  const visit = data?.data.results?.[0];

  return {
    visit: visit
      ? {
          service: visit.visitType?.display ?? '',
          location: visit.location?.display ?? '',
        }
      : null,
    error,
    isLoading,
  };
}
