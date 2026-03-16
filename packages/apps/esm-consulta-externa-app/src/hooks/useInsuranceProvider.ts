import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

interface InsuranceEntry {
  uuid: string;
  display: string;
  obsDatetime: string;
  encounterType: string | null;
}

interface ObsResult {
  uuid: string;
  display: string;
  obsDatetime: string;
  value: { display: string } | string;
  encounter: {
    encounterType: { display: string };
  };
}

export function useInsuranceProvider(patientUuid: string, conceptUuid: string) {
  const url = patientUuid && conceptUuid
    ? `${restBaseUrl}/obs?patient=${patientUuid}&concept=${conceptUuid}&v=custom:(uuid,display,obsDatetime,value,encounter:(encounterType:(display)))&limit=20`
    : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: ObsResult[] } }>(
    url,
    openmrsFetch,
  );

  const insuranceEntries: InsuranceEntry[] = (data?.data?.results ?? []).map((obs) => ({
    uuid: obs.uuid,
    display: typeof obs.value === 'string' ? obs.value : obs.value?.display ?? '',
    obsDatetime: obs.obsDatetime,
    encounterType: obs.encounter?.encounterType?.display ?? null,
  }));

  return {
    insuranceEntries,
    isLoading,
    error,
    mutate,
  };
}
