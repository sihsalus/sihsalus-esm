import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';

import type { ConfigObject } from '../config-schema';
import type { OpenmrsEncounter } from '../types';
import { DeliveryForm_UUID, encounterRepresentation, MchEncounterType_UUID } from '../utils/constants';

export function useNeonatalSummary(patientUuid: string, encounterType: string) {
  const config = useConfig() as ConfigObject;
  const url = `/ws/rest/v1/encounter?encounterType=${MchEncounterType_UUID}&patient=${patientUuid}&v=${encounterRepresentation}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: OpenmrsEncounter[] } }, Error>(
    url,
    openmrsFetch,
  );

  const neonatalEncounter = data?.data?.results?.filter((enc) => enc.form.uuid === DeliveryForm_UUID);

  return {
    encounters: data?.data ? neonatalEncounter : [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
