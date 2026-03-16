import useSWR, { type KeyedMutator } from 'swr';
import { useConfig, restBaseUrl, openmrsFetch, type FetchResponse, type Encounter } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';

interface UseEncountersResponse {
  encounters: Encounter[] | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: KeyedMutator<FetchResponse<{ results: Encounter[] }>>;
}

export default function useEncountersCRED(patientUuid: string): UseEncountersResponse {
  const config = useConfig() as ConfigObject;

  const encounterUrl = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${config.encounterTypes.healthyChildControl}&v=custom:(uuid,encounterType,encounterDatetime)`;

  const { data, error, isLoading, mutate } = useSWR<FetchResponse<{ results: Encounter[] }>>(
    patientUuid ? encounterUrl : null,
    openmrsFetch,
  );

  const encounters = data?.data?.results;

  return {
    encounters,
    isLoading,
    error,
    mutate,
  };
}
