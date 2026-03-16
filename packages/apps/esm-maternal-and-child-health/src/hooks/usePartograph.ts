import useSWR from 'swr';
import type { OpenmrsEncounter } from '../types';
import type { OpenmrsResource } from '@openmrs/esm-framework';
import { openmrsFetch } from '@openmrs/esm-framework';
import {
  MchEncounterType_UUID,
  PartographEncounterFormUuid,
  encounterRepresentation,
  Progress_UUID,
} from '../utils/constants';

export type PartogramProgram = {
  concept: OpenmrsResource;
  obsDatetime: string;
  value: string;
  status: string;
  uuid: string;
  display: string;
};
export function usePartograph(patientUuid: string) {
  const url = `/ws/rest/v1/encounter?encounterType=${MchEncounterType_UUID}&formUuid=${PartographEncounterFormUuid}&patient=${patientUuid}&v=${encounterRepresentation}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: OpenmrsEncounter[] } }, Error>(
    url,
    openmrsFetch,
  );
  const results = data?.data ? data?.data?.results : [];
  const sortedResults = results.sort((a, b) => {
    const dateA = new Date(a.encounterDatetime).getTime();
    const dateB = new Date(b.encounterDatetime).getTime();
    return dateB - dateA;
  });
  const flattedObs = sortedResults
    .flatMap((encounter) => encounter.obs)
    .filter((obs) => obs?.concept?.uuid === Progress_UUID)
    .sort((a, b) => {
      const dateA = new Date(a.encounterDatetime).getTime();
      const dateB = new Date(b.encounterDatetime).getTime();
      return dateB - dateA;
    });
  return {
    encounters: flattedObs as Array<OpenmrsEncounter>,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
