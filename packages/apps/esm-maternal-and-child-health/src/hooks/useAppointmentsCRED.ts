//FETCH APPOINTMENTS FOR CRED SERVICE
import useSWR from 'swr';
import { restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import type { AppointmentsFetchResponse, Appointment } from '../types';

export default function useAppointmentsCRED(patientUuid: string) {
  const url = `${restBaseUrl}/appointment?patient=${patientUuid}&v=custom:(uuid,status,appointmentDate,startDateTime,service:(name))`;

  const { data, isLoading, error } = useSWR<AppointmentsFetchResponse>(url, openmrsFetch);
  return {
    appointments: data?.data ?? [],
    isLoading,
    error,
  };
}
