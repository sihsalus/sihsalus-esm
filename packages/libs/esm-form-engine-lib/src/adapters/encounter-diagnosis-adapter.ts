import { type OpenmrsResource } from '@openmrs/esm-framework/src/internal';
import { type FormContextProps } from '../provider/form-provider';
import {
  type Diagnosis,
  type DiagnosisPayload,
  type FormField,
  type FormFieldValueAdapter,
  type FormProcessorContextProps,
  type OpenmrsEncounter,
  type ValueAndDisplay,
} from '../types';
import { isTrue } from '../utils/boolean-utils';
import { getResourceUuid, gracefullySetSubmission, isPlainObject, isStringValue } from '../utils/common-utils';
import { isEmpty } from '../validators/form-validator';

export const assignedDiagnosesIds: string[] = [];

export const EncounterDiagnosisAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: unknown, context: FormContextProps): DiagnosisPayload | null {
    if (field.meta.initialValue?.omrsObject && isEmpty(value)) {
      return gracefullySetSubmission(
        field,
        undefined,
        voidDiagnosis(field.meta.initialValue.omrsObject),
      ) as DiagnosisPayload | null;
    }
    if (isStringValue(value)) {
      const previousDiagnosis = asDiagnosisResource(field.meta.initialValue?.omrsObject);
      if (previousDiagnosis && hasPreviousDiagnosisValueChanged(previousDiagnosis, value)) {
        return gracefullySetSubmission(
          field,
          editDiagnosis(value, field, previousDiagnosis, context.patient.id),
          undefined,
        ) as DiagnosisPayload;
      }
    }
    const newValue = constructNewDiagnosis(value, field, context.patient.id);
    gracefullySetSubmission(field, newValue, undefined);
    return newValue;
  },
  getInitialValue: function (
    field: FormField,
    sourceObject: OpenmrsResource,
    context: FormProcessorContextProps,
  ): string | null {
    const encounter = getEncounterWithDiagnoses(sourceObject ?? context.domainObjectValue);
    const matchedDiagnosis = encounter?.diagnoses?.find(
      (diagnosis) => diagnosis.formFieldPath === `rfe-forms-${field.id}`,
    );

    if (matchedDiagnosis) {
      const codedUuid = getDiagnosisCodedUuid(matchedDiagnosis);
      field.meta = {
        ...(field.meta || {}),
        initialValue: {
          omrsObject: matchedDiagnosis,
          refinedValue: codedUuid ?? null,
        },
      };
      if (codedUuid && !assignedDiagnosesIds.includes(codedUuid)) {
        assignedDiagnosesIds.push(codedUuid);
      }
      return codedUuid ?? null;
    }
    return null;
  },
  getPreviousValue: function (
    _field: FormField,
    _sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): ValueAndDisplay | null {
    return null;
  },
  getDisplayValue: (field: FormField, value: unknown): unknown => {
    return field.questionOptions.answers?.find((option) => option.concept === value)?.label || value;
  },
  tearDown: function (): void {
    assignedDiagnosesIds.length = 0;
  },
};

const constructNewDiagnosis = (value: unknown, field: FormField, patientUuid: string): DiagnosisPayload | null => {
  if (!isStringValue(value) || !value) {
    return null;
  }
  return {
    patient: patientUuid,
    condition: null,
    diagnosis: {
      coded: value,
    },
    certainty: isTrue(field.questionOptions?.diagnosis?.isConfirmed) ? 'CONFIRMED' : 'PROVISIONAL',
    rank: field.questionOptions.diagnosis?.rank ?? 1, // rank 1 denotes a diagnosis is primary, else secondary
    formFieldPath: `rfe-forms-${field.id}`,
    formFieldNamespace: 'rfe-forms',
  };
};

function editDiagnosis(
  newEncounterDiagnosis: string,
  field: FormField,
  previousDiagnosis: DiagnosisLikeResource,
  patientUuid: string,
): DiagnosisPayload {
  return {
    patient: patientUuid,
    condition: null,
    diagnosis: {
      coded: newEncounterDiagnosis,
    },
    certainty: isTrue(field.questionOptions?.diagnosis?.isConfirmed) ? 'CONFIRMED' : 'PROVISIONAL',
    rank: field.questionOptions.diagnosis?.rank ?? 1, // rank 1 denotes a diagnosis is primary, else secondary
    formFieldPath: `rfe-forms-${field.id}`,
    formFieldNamespace: 'rfe-forms',
    uuid: previousDiagnosis.uuid,
  };
}

export function hasPreviousDiagnosisValueChanged(
  previousDiagnosis: DiagnosisLikeResource | null,
  newValue: string,
): boolean {
  if (isEmpty(previousDiagnosis)) {
    return false;
  }
  return getDiagnosisCodedUuid(previousDiagnosis) !== newValue;
}

export function voidDiagnosis(diagnosis: unknown): { uuid: string; voided: true } | undefined {
  const uuid = getResourceUuid(diagnosis);
  return uuid ? { uuid, voided: true } : undefined;
}

function getEncounterWithDiagnoses(source: unknown): OpenmrsEncounter | null {
  return isPlainObject(source) && Array.isArray((source as OpenmrsEncounter).diagnoses)
    ? (source as OpenmrsEncounter)
    : null;
}

function getDiagnosisCodedUuid(diagnosis: Diagnosis | DiagnosisPayload | OpenmrsResource): string | undefined {
  if (!isPlainObject(diagnosis) || !isPlainObject(diagnosis.diagnosis)) {
    return undefined;
  }

  const coded = diagnosis.diagnosis.coded;
  return getResourceUuid(coded);
}

function asDiagnosisResource(value: unknown): OpenmrsResource | null {
  return isPlainObject(value) && typeof value.uuid === 'string' ? (value as OpenmrsResource) : null;
}

type DiagnosisLikeResource = OpenmrsResource;
