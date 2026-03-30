import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import isNil from 'lodash-es/isNil';
import type { Subscription } from '../types';

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

export async function updateSubscription(subscription: Subscription, abortController?: AbortController) {
  const url = isNil(subscription.uuid)
    ? '/ws/rest/v1/openconceptlab/subscription'
    : `/ws/rest/v1/openconceptlab/subscription/${subscription.uuid}`;
  return openmrsFetch<Subscription>(url, {
    method: 'POST',
    body: subscription,
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController?.signal,
  });
}

export async function deleteSubscription(subscription: Subscription, abortController?: AbortController) {
  const url = `/ws/rest/v1/openconceptlab/subscription/${subscription.uuid}`;
  return openmrsFetch<Subscription>(url, {
    method: 'DELETE',
    signal: abortController?.signal,
  });
}
