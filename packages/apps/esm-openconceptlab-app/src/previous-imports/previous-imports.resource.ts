import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import type { Import } from '../types';

export function usePreviousImports() {
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Import[] } }, Error>(
    '/ws/rest/v1/openconceptlab/import?v=full',
    openmrsFetch,
  );

  return {
    data: data?.data?.results,
    error,
    isLoading,
    isValidating,
  };
}
