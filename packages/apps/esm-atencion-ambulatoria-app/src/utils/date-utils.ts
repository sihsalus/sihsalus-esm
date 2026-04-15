/**
 * Utilidades de fecha robustas para OpenMRS ESM SIHSALUS
 *
 * Este módulo soluciona el problema principal:
 * - OpenMRS espera: "YYYY-MM-DDTHH:mm:ss.sssZ" (ISO 8601 completo)
 * - Frontend enviaba: "YYYY-MM-DD" (solo fecha)
 * - Resultado: "Unparseable date" errors
 */

import { isOmrsDateStrict, parseDate } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extender dayjs con plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Formato estándar de OpenMRS con zona horaria
 */
export const OMRS_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

/**
 * Formatos de fecha comunes que OpenMRS puede manejar
 */
export const SUPPORTED_DATE_FORMATS = [
  'YYYY-MM-DD',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZZ',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'DD-MM-YYYY',
  'MM-DD-YYYY',
];

export interface DateFormatOptions {
  includeTime?: boolean;
  useTimezone?: boolean;
  defaultToStartOfDay?: boolean;
  defaultToEndOfDay?: boolean;
}

function parseDayjsFromString(dateValue: string): dayjs.Dayjs {
  if (isOmrsDateStrict(dateValue)) {
    return dayjs(parseDate(dateValue));
  }
  const direct = dayjs(dateValue);
  if (direct.isValid()) return direct;
  for (const format of SUPPORTED_DATE_FORMATS) {
    const formatted = dayjs(dateValue, format);
    if (formatted.isValid()) return formatted;
  }
  return direct;
}

function parseDateInput(dateValue: string | Date | dayjs.Dayjs): dayjs.Dayjs {
  if (dayjs.isDayjs(dateValue)) return dateValue;
  if (dateValue instanceof Date) return dayjs(dateValue);
  if (typeof dateValue === 'string') return parseDayjsFromString(dateValue);
  throw new Error(`Unsupported date type: ${typeof dateValue}`);
}

function applyTimeModifiers(date: dayjs.Dayjs, options: DateFormatOptions): dayjs.Dayjs {
  const { includeTime = true, defaultToStartOfDay = false, defaultToEndOfDay = false } = options;
  if (defaultToStartOfDay) return date.startOf('day');
  if (defaultToEndOfDay) return date.endOf('day');
  if (!includeTime) return date.startOf('day');
  return date;
}

function formatDayjsDate(date: dayjs.Dayjs, useTimezone: boolean): string {
  if (useTimezone) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return date.tz(userTimezone).format(OMRS_DATE_FORMAT);
  }
  return date.format(OMRS_DATE_FORMAT);
}

/**
 * Convierte cualquier valor de fecha a formato ISO OpenMRS
 * Esta es la función principal que soluciona el problema de "Unparseable date"
 */
export function toOpenmrsIsoString(
  dateValue: string | Date | dayjs.Dayjs | null | undefined,
  options: DateFormatOptions = {},
): string {
  const { useTimezone = true } = options;

  if (!dateValue) {
    throw new Error('Date value is required');
  }

  try {
    let parsedDate = parseDateInput(dateValue);

    if (!parsedDate.isValid()) {
      throw new Error(`Invalid date: ${dateValue}`);
    }

    parsedDate = applyTimeModifiers(parsedDate, options);

    return formatDayjsDate(parsedDate, useTimezone);
  } catch (error) {
    console.error('Error formatting date for OpenMRS:', { dateValue, error });
    throw new Error(`Failed to format date for OpenMRS: ${error instanceof Error ? error.message : String(error)}`, {
      cause: error,
    });
  }
}

/**
 * Formatea fecha para envío de citas a OpenMRS
 */
export function toAppointmentDateTime(date: string | Date, time?: string): string {
  try {
    let baseDate = dayjs(date);

    if (time) {
      // Combinar fecha con hora específica
      const [hours, minutes] = time.split(':').map(Number);
      baseDate = baseDate.hour(hours).minute(minutes).second(0).millisecond(0);
    }

    return toOpenmrsIsoString(baseDate, { includeTime: true, useTimezone: true });
  } catch (error) {
    console.error('Error formatting appointment date:', { date, time, error });
    throw error;
  }
}

/**
 * Formatea fecha para encuentros OpenMRS
 */
export function toEncounterDateTime(date: string | Date | null | undefined): string {
  if (!date) {
    // Usar fecha y hora actual si no se proporciona
    return toOpenmrsIsoString(new Date(), { includeTime: true, useTimezone: true });
  }

  return toOpenmrsIsoString(date, { includeTime: true, useTimezone: true });
}

/**
 * Formatea fecha para observaciones OpenMRS
 */
export function toObsDateTime(date: string | Date | null | undefined, useCurrentTimeIfOnlyDate = true): string {
  if (!date) {
    return toOpenmrsIsoString(new Date(), { includeTime: true, useTimezone: true });
  }

  const parsed = dayjs(date);

  // Si solo es fecha (sin hora) y se especifica usar hora actual
  if (useCurrentTimeIfOnlyDate && parsed.hour() === 0 && parsed.minute() === 0 && parsed.second() === 0) {
    const now = dayjs();
    const withCurrentTime = parsed.hour(now.hour()).minute(now.minute()).second(now.second());

    return toOpenmrsIsoString(withCurrentTime, { includeTime: true, useTimezone: true });
  }

  return toOpenmrsIsoString(date, { includeTime: true, useTimezone: true });
}

/**
 * Valida si una fecha está en formato OpenMRS válido
 */
export function isValidOpenmrsDate(dateString: string): boolean {
  try {
    const parsed = dayjs(dateString);
    return (
      parsed.isValid() &&
      parsed.year() >= 1900 &&
      parsed.year() <= 2100 &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)
    );
  } catch {
    return false;
  }
}

/**
 * Convierte fecha de formulario HTML a formato OpenMRS
 */
export function fromFormDateToOpenmrs(formDate: string, formTime?: string): string {
  if (!formDate) {
    throw new Error('Form date is required');
  }

  // Los formularios HTML típicamente envían YYYY-MM-DD
  let date = dayjs(formDate);

  if (formTime) {
    const [hours, minutes] = formTime.split(':').map(Number);
    date = date.hour(hours).minute(minutes).second(0).millisecond(0);
  } else {
    // Si no hay hora, usar hora actual para evitar problemas de zona horaria
    const now = dayjs();
    date = date.hour(now.hour()).minute(now.minute()).second(now.second());
  }

  return toOpenmrsIsoString(date, { includeTime: true, useTimezone: true });
}

export const DateFormatters = {
  // Para formularios que envían solo fecha
  forFormSubmission: (dateValue: string | Date) =>
    toOpenmrsIsoString(dateValue, { includeTime: true, useTimezone: true }),

  // Para citas con fecha y hora específica
  forAppointment: (date: string | Date, time?: string) => toAppointmentDateTime(date, time),

  // Para encuentros médicos
  forEncounter: (date?: string | Date) => toEncounterDateTime(date),

  // Para observaciones
  forObservation: (date?: string | Date) => toObsDateTime(date),

  // Para fecha actual con formato OpenMRS
  now: () => toOpenmrsIsoString(new Date(), { includeTime: true, useTimezone: true }),

  // Para inicio del día
  startOfDay: (date: string | Date) => toOpenmrsIsoString(date, { defaultToStartOfDay: true, useTimezone: true }),

  // Para fin del día
  endOfDay: (date: string | Date) => toOpenmrsIsoString(date, { defaultToEndOfDay: true, useTimezone: true }),
};
