import { openmrsFetch } from '@openmrs/esm-framework';
import type { ImportItem } from '../../types';

export async function getImportDetails(importUuid: string, abortController?: AbortController) {
  const url = `/ws/rest/v1/openconceptlab/import/${importUuid}/item?state=ERROR&v=full`;
  return openmrsFetch<{ results: ImportItem[] }>(url, {
    method: 'GET',
    signal: abortController?.signal,
  });
}
