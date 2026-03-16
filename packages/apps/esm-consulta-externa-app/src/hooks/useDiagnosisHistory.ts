import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

interface DiagnosisEntry {
  uuid: string;
  display: string;
  encounterDatetime: string;
  cie10Code: string | null;
  certainty: 'CONFIRMED' | 'PROVISIONAL';
  occurrence: 'NEW' | 'REPEAT';
}

interface ConceptMapping {
  display?: string;
}

interface EncounterDiagnosis {
  uuid: string;
  display: string;
  diagnosis: {
    coded?: { display: string; mappings?: ConceptMapping[] };
    nonCoded?: string;
  };
  certainty: string;
  rank: number;
}

interface Encounter {
  uuid: string;
  encounterDatetime: string;
  diagnoses: EncounterDiagnosis[];
}

export function useDiagnosisHistory(patientUuid: string, encounterTypeUuid: string) {
  const url = patientUuid && encounterTypeUuid
    ? `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=custom:(uuid,encounterDatetime,diagnoses:(uuid,display,diagnosis:(coded:(display,mappings:(display))),certainty,rank))&limit=20`
    : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Encounter[] } }>(
    url,
    openmrsFetch,
  );

  const diagnoses: DiagnosisEntry[] = (data?.data?.results ?? []).flatMap((encounter) =>
    (encounter.diagnoses ?? []).map((dx) => {
      const mappings = dx.diagnosis?.coded?.mappings ?? [];
      const cie10Mapping = mappings.find((m: ConceptMapping) => m.display?.startsWith('ICD-10'));
      const cie10Code = cie10Mapping?.display?.split(': ')?.[1] ?? null;

      return {
        uuid: dx.uuid,
        display: dx.diagnosis?.coded?.display ?? dx.display ?? '',
        encounterDatetime: encounter.encounterDatetime,
        cie10Code,
        certainty: dx.certainty === 'CONFIRMED' ? 'CONFIRMED' : 'PROVISIONAL',
        occurrence: 'NEW' as const, // TODO: determine from obs when concept is available
      };
    }),
  );

  return {
    diagnoses,
    isLoading,
    error,
    mutate,
  };
}
