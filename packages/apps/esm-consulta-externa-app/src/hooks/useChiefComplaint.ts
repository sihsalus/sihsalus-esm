import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

interface ChiefComplaintObs {
  uuid: string;
  display: string;
  obsDatetime: string;
  value: string;
}

export function useChiefComplaint(patientUuid: string, conceptUuid: string) {
  const url = patientUuid && conceptUuid
    ? `${restBaseUrl}/obs?patient=${patientUuid}&concept=${conceptUuid}&v=custom:(uuid,display,obsDatetime,value)&limit=20`
    : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: ChiefComplaintObs[] } }>(
    url,
    openmrsFetch,
  );

  return {
    complaints: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
}
