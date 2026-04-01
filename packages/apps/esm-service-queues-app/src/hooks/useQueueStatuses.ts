import {
  type FetchResponse,
  OpenmrsResource,
  openmrsFetch,
  restBaseUrl,
  useOpenmrsSWR,
  getLocale,
} from '@openmrs/esm-framework';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import type { Concept } from '../types';

import { useQueues } from './useQueues';
import { useSystemSetting } from './useSystemSetting';

function useQueueStatuses() {
  const { queues, isLoading } = useQueues();

  const results = useMemo(() => {
    const allStatuses = ([] as Array<Concept>).concat(...(queues ?? [])?.map((queue) => queue?.allowedStatuses));

    const uuidSet = new Set<string>();

    const statuses: Array<Concept> = [];

    allStatuses.forEach((status) => {
      if (!uuidSet.has(status?.uuid)) {
        uuidSet.add(status?.uuid);
        statuses.push(status);
      }
    });

    return {
      statuses: statuses.sort((a, b) => a.display.localeCompare(b.display, getLocale())),
      isLoadingQueueStatuses: isLoading,
    };
  }, [isLoading, queues]);

  return results;
}
export default useQueueStatuses;
