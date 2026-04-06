import { z } from 'zod';
import type { ConceptReferenceRange } from '../hooks/useConceptReferenceRanges';

export type VitalFieldName = 'temperature' | 'heartRate' | 'respiratoryRate' | 'systolicBp' | 'diastolicBp' | 'oxygenSaturation';

/** System-level absolute ranges for vital signs (from OpenMRS concept_numeric) */
export const vitalSignRanges: Record<VitalFieldName, { min: number; max: number }> = {
  temperature: { min: 25, max: 47 },
  heartRate: { min: 0, max: 230 },
  respiratoryRate: { min: 0, max: 99 },
  systolicBp: { min: 0, max: 250 },
  diastolicBp: { min: 0, max: 150 },
  oxygenSaturation: { min: 0, max: 100 },
};

export const triageFormSchema = z.object({
  // Anamnesis
  illnessDuration: z.string().optional(),
  onsetType: z.string().optional(),
  course: z.string().optional(),
  anamnesis: z.string().optional(),

  // Signos vitales
  temperature: z.number().min(vitalSignRanges.temperature.min, `Mínimo ${vitalSignRanges.temperature.min}°C`).max(vitalSignRanges.temperature.max, `Máximo ${vitalSignRanges.temperature.max}°C`).optional(),
  heartRate: z.number().min(vitalSignRanges.heartRate.min, `Mínimo ${vitalSignRanges.heartRate.min} lpm`).max(vitalSignRanges.heartRate.max, `Máximo ${vitalSignRanges.heartRate.max} lpm`).optional(),
  respiratoryRate: z.number().min(vitalSignRanges.respiratoryRate.min, `Mínimo ${vitalSignRanges.respiratoryRate.min} rpm`).max(vitalSignRanges.respiratoryRate.max, `Máximo ${vitalSignRanges.respiratoryRate.max} rpm`).optional(),
  systolicBp: z.number().min(vitalSignRanges.systolicBp.min, `Mínimo ${vitalSignRanges.systolicBp.min} mmHg`).max(vitalSignRanges.systolicBp.max, `Máximo ${vitalSignRanges.systolicBp.max} mmHg`).optional(),
  diastolicBp: z.number().min(vitalSignRanges.diastolicBp.min, `Mínimo ${vitalSignRanges.diastolicBp.min} mmHg`).max(vitalSignRanges.diastolicBp.max, `Máximo ${vitalSignRanges.diastolicBp.max} mmHg`).optional(),
  oxygenSaturation: z.number().min(vitalSignRanges.oxygenSaturation.min, `Mínimo ${vitalSignRanges.oxygenSaturation.min}%`).max(vitalSignRanges.oxygenSaturation.max, `Máximo ${vitalSignRanges.oxygenSaturation.max}%`).optional(),
  consciousnessLevel: z.enum(['alert', 'verbal', 'pain', 'unresponsive']).optional(),

  // Antropometría
  weight: z.number().min(0, 'Mínimo 0 kg').max(250, 'Máximo 250 kg').optional(),
  height: z.number().min(10, 'Mínimo 10 cm').max(272, 'Máximo 272 cm').optional(),

  // Examen clínico
  clinicalExam: z.string().optional(),

  // Prioridad
  priorityUuid: z.string().uuid('Debe seleccionar una prioridad'),
});

export type TriageFormData = z.infer<typeof triageFormSchema>;

export type ObservationInterpretation = 'critically_low' | 'critically_high' | 'high' | 'low' | 'normal';

/**
 * Determines the clinical interpretation of a vital sign value against its reference range.
 * Uses the same logic as openmrs-esm-patient-chart assessValue().
 */
export function assessValue(value: number | undefined, range?: ConceptReferenceRange): ObservationInterpretation {
  if (range && value != null) {
    if (range.hiCritical != null && value >= range.hiCritical) {
      return 'critically_high';
    }
    if (range.hiNormal != null && value > range.hiNormal) {
      return 'high';
    }
    if (range.lowCritical != null && value <= range.lowCritical) {
      return 'critically_low';
    }
    if (range.lowNormal != null && value < range.lowNormal) {
      return 'low';
    }
  }
  return 'normal';
}

export interface RangeValidationError {
  field: VitalFieldName;
  message: string;
}

/**
 * Validates vital sign values against patient-specific absolute ranges before submit.
 * Returns field-level errors for values the backend will reject.
 */
export function validateVitalsAgainstRanges(
  data: TriageFormData,
  fieldToConceptUuid: Record<VitalFieldName, string>,
  referenceRanges: Record<string, ConceptReferenceRange>,
  t: (key: string, defaultValue: string, options?: Record<string, unknown>) => string,
): RangeValidationError[] {
  const errors: RangeValidationError[] = [];

  for (const [field, conceptUuid] of Object.entries(fieldToConceptUuid) as Array<[VitalFieldName, string]>) {
    const value = data[field];
    if (value == null) continue;

    const range = referenceRanges[conceptUuid];
    if (!range) continue;

    if (range.lowAbsolute != null && value < range.lowAbsolute) {
      errors.push({
        field,
        message: t('valueBelowAbsolute', 'Valor {{value}} fuera del rango permitido (mín: {{min}} {{units}})', {
          value, min: range.lowAbsolute, units: range.units,
        }),
      });
    } else if (range.hiAbsolute != null && value > range.hiAbsolute) {
      errors.push({
        field,
        message: t('valueAboveAbsolute', 'Valor {{value}} fuera del rango permitido (máx: {{max}} {{units}})', {
          value, max: range.hiAbsolute, units: range.units,
        }),
      });
    }
  }

  return errors;
}
