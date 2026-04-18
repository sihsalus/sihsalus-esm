import { usePatient } from '@openmrs/esm-framework';

function calculateAge(birthDate: Date): number {
  const today = new Date();
  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    // subtract one year if the current date is before the birth date this year
    return yearsDiff - 1;
  } else {
    return yearsDiff;
  }
}

const patientGenderMap = {
  female: 'F',
  male: 'M',
  other: 'O',
  unknown: 'U',
};

type AugmentedPatient = fhir.Patient & {
  age?: number;
  sex?: string;
  gender?: keyof typeof patientGenderMap;
  birthDate?: string;
};

export const usePatientData = (
  patientUuid: string,
): {
  patient: AugmentedPatient | undefined;
  isLoadingPatient: boolean;
  patientError: Error | undefined;
} => {
  const {
    patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(patientUuid) as {
    patient?: AugmentedPatient;
    isLoading: boolean;
    error?: Error;
  };

  const normalizedPatient =
    patient && !isLoadingPatient && typeof patient.birthDate === 'string'
      ? {
          ...patient,
          age: calculateAge(new Date(patient.birthDate)),
          sex: patient.gender ? (patientGenderMap[patient.gender] ?? 'U') : 'U',
        }
      : patient;

  return { patient: normalizedPatient, isLoadingPatient, patientError };
};
