import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

import type { PatientAppointment } from '../../types';

type AppointmentFilters = {
  startDate: string;
  serviceType?: string;
};

export const useAppointmentsByPatient = (patientUuid: string, filters: AppointmentFilters) => {
  const { data, error, isLoading, isValidating } = useSWR<{ data: { results: Array<PatientAppointment> } }>(
    `${restBaseUrl}/appointments/search?patient=${patientUuid}&startDate=${filters.startDate}`, //Modify with the correct path
    openmrsFetch,
  );

  const sourceAppointments = data?.data?.results ?? [];
  const appointments = filters.serviceType
    ? sourceAppointments.filter((appointment) => appointment.serviceType === filters.serviceType)
    : sourceAppointments;

  return {
    appointments,
    error,
    isLoading,
    isValidating,
  };
};
