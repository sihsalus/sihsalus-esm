import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

import type { ImportItem } from '../../types';

export function useImportItems(importUuid: string | undefined) {
  const url = importUuid ? `/ws/rest/v1/openconceptlab/import/${importUuid}/item?state=ERROR&v=full` : null;

  const { data, error, isLoading } = useSWR<{ data: { results: ImportItem[] } }, Error>(url, openmrsFetch, {
    onErrorRetry(err: unknown, _key: unknown, _config: unknown, revalidate: (opts: { retryCount: number }) => void, { retryCount }: { retryCount: number }) {
      const status = (err as { status?: number })?.status;
      if (status === 401 || status === 403) return;
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  return {
    data: data?.data?.results,
    error,
    isLoading,
  };
}
