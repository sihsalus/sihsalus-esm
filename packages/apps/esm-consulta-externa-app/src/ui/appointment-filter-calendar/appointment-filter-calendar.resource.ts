import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
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

  let appointments = data?.data.results;

  if (filters.serviceType) {
    appointments = appointments.filter((appointment) => appointment.serviceType === filters.serviceType);
  }

  //mocking the appointments
  appointments = [
    {
      appointmentId: '1',
      appointmentDate: '2025-02-11T12:00:00Z',
      serviceType: 'Consulta',
    },
    {
      appointmentId: '2',
      appointmentDate: '2025-02-14T12:00:00Z',
      serviceType: 'Consulta',
    },
    {
      appointmentId: '3',
      appointmentDate: '2025-02-20T12:00:00Z',
      serviceType: 'Consulta',
    },
  ];

  return {
    appointments,
    error,
    isLoading,
    isValidating,
  };
};
