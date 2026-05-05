import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import useSWR from 'swr';

import type { AppointmentsFetchResponse } from '../types';

export default function useAppointmentsCRED(patientUuid: string) {
  const startDate = dayjs().startOf('day').toISOString();
  const { data, isLoading, error } = useSWR<AppointmentsFetchResponse, Error>(
    patientUuid ? [`${restBaseUrl}/appointments/search`, patientUuid, startDate] : null,
    ([url]) =>
      openmrsFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          patientUuid,
          startDate,
        },
      }),
  );

  return {
    appointments: data?.data ?? [],
    isLoading,
    error,
  };
}
