import { type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';
import useSWRImmutable from 'swr/immutable';

export function useEncounterRole(): {
  encounterRole: OpenmrsResource | undefined;
  error: Error | undefined;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useSWRImmutable<{ data: { results: Array<OpenmrsResource> } }, Error>(
    `${restBaseUrl}/encounterrole?v=custom:(uuid,display,name)`,
    openmrsFetch,
  );
  const clinicalEncounterRole = data?.data.results.find((encounterRole) => encounterRole.name === 'Clinician');

  if (clinicalEncounterRole) {
    return { encounterRole: clinicalEncounterRole, error, isLoading };
  }
  return { encounterRole: data?.data.results[0], error, isLoading };
}
