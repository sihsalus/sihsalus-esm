import { useConfig } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';
import { useFilteredEncounter } from './useFilteredEncounter';

export const useCurrentPregnancy = (patientUuid: string) => {
  const config = useConfig<ConfigObject>();
  return useFilteredEncounter(
    patientUuid,
    config?.encounterTypes?.prenatalControl,
    config?.formsList?.currentPregnancy,
  );
};
