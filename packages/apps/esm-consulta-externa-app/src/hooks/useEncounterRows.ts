import useSWRImmutable from 'swr';
import { useCallback, useMemo } from 'react';
import { openmrsFetch } from '@openmrs/esm-framework';
import type { OpenmrsEncounter } from '../types';
import isNull from 'lodash-es/isNull';

export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

export interface OpenmrsResource {
  uuid: string;
  display?: string;
  [anythingElse: string]: unknown;
}

export function useEncounterRows(patientUuid: string, encounterType: string, encounterFilter: (encounter) => boolean) {
  const url = `/ws/rest/v1/encounter?encounterType=${encounterType}&patient=${patientUuid}&v=${encounterRepresentation}`;

  const { data, error, isLoading, mutate } = useSWRImmutable<{ data: { results: Array<OpenmrsEncounter> } }, Error>(
    url,
    openmrsFetch,
  );

  // Sort and filter directly in the render
  const sortedAndFilteredEncounters = useMemo(() => {
    if (isNull(data?.data?.results) || !isLoading) {
      const sortedEncounters = sortEncounters(data?.data?.results);
      return encounterFilter ? sortedEncounters.filter(encounterFilter) : sortedEncounters;
    }
    return [];
  }, [data, encounterFilter, isLoading]);

  const onFormSave = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    encounters: sortedAndFilteredEncounters,
    isLoading,
    error,
    onFormSave,
    mutate,
  };
}

function sortEncounters(encounters: OpenmrsEncounter[]): OpenmrsEncounter[] {
  if (encounters?.length > 0) {
    return [...encounters]?.sort(
      (a, b) => new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime(),
    );
  } else {
    return [];
  }
}
