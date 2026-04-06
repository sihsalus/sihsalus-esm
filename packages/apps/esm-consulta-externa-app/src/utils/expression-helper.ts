import { makeUrl } from '@openmrs/esm-framework';
import { type PatientProgram, safeEvaluateExpression } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';

/**
 * Evaluates a given expression using patient data and their program enrollments.
 */
export const evaluateExpression = (
  expression: string,
  patient: fhir.Patient | null | undefined,
  enrollments: Array<PatientProgram> | null | undefined,
): boolean => {
  if (!expression) {
    return true;
  }

  if (expression.includes('patient') && !patient) {
    return false;
  }

  const enrollment = enrollments ? enrollments.flatMap((e) => e?.program?.['name']).filter(Boolean) : [];
  const programUuids = enrollments ? enrollments.flatMap((e) => e?.program?.['uuid']).filter(Boolean) : [];

  return safeEvaluateExpression(expression, {
    patient: patient ?? {},
    enrollment,
    programUuids,
  });
};

export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
}

export function extractNameString(formattedString: string): string {
  if (!formattedString) {
    return '';
  }
  const parts = formattedString.split(' - ');
  return parts.length > 1 ? parts[1] : '';
}

export const formatPatientName = (patient): string => {
  if (!patient || !patient.name || patient.name.length === 0) {
    return '';
  }

  const nameObj = patient.name[0];
  const givenNames = nameObj.given ? nameObj.given.join(' ') : '';
  const familyName = nameObj.family || '';

  return `${givenNames} ${familyName}`.trim();
};

export const uppercaseText = (text): string => {
  return text.toUpperCase();
};

export function makeUrlUrl(path: string) {
  return new URL(makeUrl(path), window.location.toString());
}

/**
 * Formats a given date string into "DD-MMM-YYYY, hh:mm A" format.
 *
 * @param {string | Date | undefined} date - The date to format.
 * @returns {string} - The formatted date or an empty string if no date is provided.
 */
export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format('DD-MMM-YYYY, hh:mm A');
};

/**
 * Calculates the number of days from the given date to today.
 *
 * @param startDate - The starting date in string or Date format.
 * @returns The number of days from the start date to today.
 */
export function convertDateToDays(startDate: string | Date): number {
  const today = dayjs();
  const start = dayjs(startDate);
  return today.diff(start, 'day');
}
