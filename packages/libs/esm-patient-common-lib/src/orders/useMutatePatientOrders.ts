import { restBaseUrl } from '@openmrs/esm-framework';
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

export function useMutatePatientOrders(patientUuid: string) {
  const { mutate } = useSWRConfig();

  return {
    mutate: useCallback(
      () =>
        mutate(
          (key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?patient=${patientUuid}`),
          undefined,
          { revalidate: true },
        ),
      [mutate, patientUuid],
    ),
  };
}
