import { type Concept, type FetchResponse, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

export function useConceptSearch(query: string) {
  const { data, ...rest } = useSWRImmutable<FetchResponse<{ results: Array<Concept> }>, Error>(
    query ? `${restBaseUrl}/concept?q=${query}&v=full` : null,
    openmrsFetch,
  );

  const results = useMemo(
    () => ({
      concepts: data?.data?.results,
      ...rest,
    }),
    [data, rest],
  );

  return results;
}
