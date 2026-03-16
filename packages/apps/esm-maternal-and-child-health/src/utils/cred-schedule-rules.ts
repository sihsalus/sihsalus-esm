import dayjs from 'dayjs';

export type CREDPhase = 'neonatal' | 'infant' | 'toddler' | 'preschool' | 'school';

export interface CREDControlDefinition {
  controlNumber: number;
  label: string;
  targetAgeDays: number;
  ageGroupLabel: string;
  phase: CREDPhase;
}

export interface CREDScheduledControl extends CREDControlDefinition {
  targetDate: Date;
}

/**
 * NTS 137-MINSA: 33 controles CRED desde recién nacido hasta 11 años.
 *
 * Neonatal (4): 2d, 7d, 14d, 21d
 * 0-11 meses (11): mensual de 1m a 11m
 * 12-23 meses (5): 12m, 15m, 18m, 21m, 24m
 * 24-59 meses (6): 30m, 36m, 42m, 48m, 54m, 60m
 * 5-11 años (7): anual de 6a a 12a
 */
const CRED_CONTROL_DEFINITIONS: CREDControlDefinition[] = [
  // Neonatal (4 controles)
  { controlNumber: 1, label: 'RN - 48h', targetAgeDays: 2, ageGroupLabel: 'RN - 48h', phase: 'neonatal' },
  { controlNumber: 2, label: 'RN - 7d', targetAgeDays: 7, ageGroupLabel: 'RN - 7d', phase: 'neonatal' },
  { controlNumber: 3, label: 'RN - 14d', targetAgeDays: 14, ageGroupLabel: 'RN - 14d', phase: 'neonatal' },
  { controlNumber: 4, label: 'RN - 21d', targetAgeDays: 21, ageGroupLabel: 'RN - 21d', phase: 'neonatal' },

  // 0-11 meses (11 controles, mensual)
  { controlNumber: 5, label: '1 mes', targetAgeDays: 30, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 6, label: '2 meses', targetAgeDays: 61, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 7, label: '3 meses', targetAgeDays: 91, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 8, label: '4 meses', targetAgeDays: 122, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 9, label: '5 meses', targetAgeDays: 152, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 10, label: '6 meses', targetAgeDays: 183, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 11, label: '7 meses', targetAgeDays: 213, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 12, label: '8 meses', targetAgeDays: 244, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 13, label: '9 meses', targetAgeDays: 274, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 14, label: '10 meses', targetAgeDays: 304, ageGroupLabel: '0 AÑOS', phase: 'infant' },
  { controlNumber: 15, label: '11 meses', targetAgeDays: 335, ageGroupLabel: '0 AÑOS', phase: 'infant' },

  // 12-23 meses (5 controles)
  { controlNumber: 16, label: '12 meses', targetAgeDays: 365, ageGroupLabel: '1 AÑO', phase: 'toddler' },
  { controlNumber: 17, label: '15 meses', targetAgeDays: 456, ageGroupLabel: '1 AÑO', phase: 'toddler' },
  { controlNumber: 18, label: '18 meses', targetAgeDays: 548, ageGroupLabel: '1 AÑO', phase: 'toddler' },
  { controlNumber: 19, label: '21 meses', targetAgeDays: 639, ageGroupLabel: '1 AÑO', phase: 'toddler' },
  { controlNumber: 20, label: '24 meses', targetAgeDays: 730, ageGroupLabel: '2 AÑOS', phase: 'toddler' },

  // 24-59 meses (6 controles, semestral)
  { controlNumber: 21, label: '30 meses', targetAgeDays: 913, ageGroupLabel: '2 AÑOS', phase: 'preschool' },
  { controlNumber: 22, label: '36 meses', targetAgeDays: 1096, ageGroupLabel: '3 AÑOS', phase: 'preschool' },
  { controlNumber: 23, label: '42 meses', targetAgeDays: 1278, ageGroupLabel: '3 AÑOS', phase: 'preschool' },
  { controlNumber: 24, label: '48 meses', targetAgeDays: 1461, ageGroupLabel: '4 AÑOS', phase: 'preschool' },
  { controlNumber: 25, label: '54 meses', targetAgeDays: 1643, ageGroupLabel: '4 AÑOS', phase: 'preschool' },
  { controlNumber: 26, label: '60 meses', targetAgeDays: 1826, ageGroupLabel: '5 AÑOS', phase: 'preschool' },

  // 5-11 años (7 controles, anual)
  { controlNumber: 27, label: '6 años', targetAgeDays: 2191, ageGroupLabel: '6 AÑOS', phase: 'school' },
  { controlNumber: 28, label: '7 años', targetAgeDays: 2557, ageGroupLabel: '7 AÑOS', phase: 'school' },
  { controlNumber: 29, label: '8 años', targetAgeDays: 2922, ageGroupLabel: '8 AÑOS', phase: 'school' },
  { controlNumber: 30, label: '9 años', targetAgeDays: 3287, ageGroupLabel: '9 AÑOS', phase: 'school' },
  { controlNumber: 31, label: '10 años', targetAgeDays: 3652, ageGroupLabel: '10 AÑOS', phase: 'school' },
  { controlNumber: 32, label: '11 años', targetAgeDays: 4018, ageGroupLabel: '11 AÑOS', phase: 'school' },
  { controlNumber: 33, label: '12 años', targetAgeDays: 4383, ageGroupLabel: '11 AÑOS', phase: 'school' },
];

/**
 * Retorna las definiciones estáticas de los 33 controles CRED.
 */
export function getCREDControlDefinitions(): CREDControlDefinition[] {
  return CRED_CONTROL_DEFINITIONS;
}

/**
 * Genera el calendario CRED completo con fechas concretas a partir de la fecha de nacimiento.
 */
export function generateCREDSchedule(birthDate: string | Date): CREDScheduledControl[] {
  const birth = dayjs(birthDate);

  return CRED_CONTROL_DEFINITIONS.map((def) => ({
    ...def,
    targetDate: birth.add(def.targetAgeDays, 'day').toDate(),
  }));
}
