import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import type { DropdownValue, Response } from '../../types';

/**
 * @returns Drugs
 */
export function useDrugs() {
  const { data, error } = useSWRImmutable<{
    data: { results: Response[] };
  }>(`${restBaseUrl}/drug`, openmrsFetch);

  const results = useMemo(() => {
    const drugs: DropdownValue[] = [];
    data?.data.results.forEach((drug: Response, index: number) => {
      drugs.push({
        id: index,
        label: drug.display,
        value: drug.uuid,
      });
    });
    return {
      isLoading: !data && !error,
      drugs,
      drugsError: error,
    };
  }, [data, error]);

  return results;
}

/**
 * @returns CareSettings
 */
export function useCareSettings() {
  const { data, error } = useSWRImmutable<{
    data: { results: Response[] };
  }>(`${restBaseUrl}/caresetting`, openmrsFetch);

  const results = useMemo(() => {
    const careSettings: DropdownValue[] = [];
    data?.data.results.forEach((careSetting: Response, index: number) => {
      careSettings.push({
        id: index,
        label: careSetting.display,
        value: careSetting.uuid,
      });
    });
    return {
      isLoading: !data && !error,
      careSettings,
      careSettingsError: error,
    };
  }, [data, error]);

  return results;
}
