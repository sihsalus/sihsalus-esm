import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import type { Import, Subscription } from '../types';

export function useSubscription() {
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Subscription[] } }, Error>(
    '/ws/rest/v1/openconceptlab/subscription?v=full',
    openmrsFetch,
  );

  return {
    data: data?.data?.results[0],
    error,
    isLoading,
    isValidating,
  };
}

export async function startImportWithSubscription(abortController?: AbortController) {
  const url = '/ws/rest/v1/openconceptlab/import';
  return openmrsFetch<Import>(url, {
    method: 'POST',
    body: {},
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController?.signal,
  });
}

export async function startImportWithFile(file: File, abortController?: AbortController) {
  const url = '/ws/rest/v1/openconceptlab/import';
  const formData: FormData = new FormData();
  formData.append('file', file);
  return openmrsFetch<Import>(url, {
    method: 'POST',
    body: formData,
    signal: abortController?.signal,
  });
}
