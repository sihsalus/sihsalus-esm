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

/**
 * Convierte cualquier valor de fecha a formato ISO OpenMRS
 * Esta es la función principal que soluciona el problema de "Unparseable date"
 */
export function toOpenmrsIsoString(
  dateValue: string | Date | dayjs.Dayjs | null | undefined,
  options: DateFormatOptions = {},
): string {
  const { includeTime = true, useTimezone = true, defaultToStartOfDay = false, defaultToEndOfDay = false } = options;

  if (!dateValue) {
    throw new Error('Date value is required');
  }

  try {
    let parsedDate: dayjs.Dayjs;

    // Manejar diferentes tipos de entrada
    if (dayjs.isDayjs(dateValue)) {
      parsedDate = dateValue;
    } else if (dateValue instanceof Date) {
      parsedDate = dayjs(dateValue);
    } else if (typeof dateValue === 'string') {
      // Intentar con OpenMRS parseDate primero
      if (isOmrsDateStrict(dateValue)) {
        const omrsDate = parseDate(dateValue);
        parsedDate = dayjs(omrsDate);
      } else {
        // Fallback a dayjs con formatos múltiples
        parsedDate = dayjs(dateValue);

        // Si no es válido, intentar formatos específicos
        if (!parsedDate.isValid()) {
          for (const format of SUPPORTED_DATE_FORMATS) {
            parsedDate = dayjs(dateValue, format);
            if (parsedDate.isValid()) break;
          }
        }
      }
    } else {
      throw new Error(`Unsupported date type: ${typeof dateValue}`);
    }

    // Validar que la fecha es válida
    if (!parsedDate.isValid()) {
      throw new Error(`Invalid date: ${dateValue}`);
    }

    // Aplicar modificadores de tiempo
    if (defaultToStartOfDay) {
      parsedDate = parsedDate.startOf('day');
    } else if (defaultToEndOfDay) {
      parsedDate = parsedDate.endOf('day');
    }

    // Formatear según opciones
    if (!includeTime) {
      // Solo fecha, pero en formato ISO con tiempo 00:00:00
      parsedDate = parsedDate.startOf('day');
    }

    // Usar timezone del navegador si se especifica
    if (useTimezone) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return parsedDate.tz(userTimezone).format(OMRS_DATE_FORMAT);
    } else {
      return parsedDate.format(OMRS_DATE_FORMAT);
    }
  } catch (error) {
    console.error('Error formatting date for OpenMRS:', { dateValue, error });
    throw new Error(`Failed to format date for OpenMRS: ${error instanceof Error ? error.message : String(error)}`);
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
