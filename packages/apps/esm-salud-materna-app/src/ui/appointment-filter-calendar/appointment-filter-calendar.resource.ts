import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

import type { Appointment, PatientAppointment } from '../../types';

type AppointmentFilters = {
  startDate: string;
  serviceType?: string;
};

export const useAppointmentsByPatient = (patientUuid: string, filters: AppointmentFilters) => {
  const { data, error, isLoading, isValidating } = useSWR<{ data: Array<Appointment> }, Error>(
    patientUuid ? [`${restBaseUrl}/appointments/search`, patientUuid, filters.startDate] : null,
    ([url]) =>
      openmrsFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          patientUuid,
          startDate: filters.startDate,
        },
      }),
  );

  const sourceAppointments = (data?.data ?? []).map(mapAppointmentForCalendar);
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

function mapAppointmentForCalendar(appointment: Appointment): PatientAppointment {
  return {
    ...appointment,
    appointmentDate: appointment.startDateTime,
    appointmentId: appointment.uuid,
    serviceType: appointment.service?.name ?? '',
  };
}
