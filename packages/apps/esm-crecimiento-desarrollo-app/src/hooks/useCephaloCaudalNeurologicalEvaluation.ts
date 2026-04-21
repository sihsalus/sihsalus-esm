import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';

import type { ConfigObject } from '../config-schema'; // Adjust the import path as needed
import type { Encounter } from '@sihsalus/esm-sihsalus-shared';
import { encounterRepresentation } from '../utils/constants'; // Adjust the import path as needed

export function useCephaloCaudalNeurologicalEvaluation(patientUuid: string) {
  const config = useConfig() as ConfigObject;
  const url = `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${config.encounterTypes.postnatalControl}&v=${encounterRepresentation}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: Array<Encounter> } }, Error>(
    url,
    openmrsFetch,
  );

  return {
    encounters: data?.data?.results || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
