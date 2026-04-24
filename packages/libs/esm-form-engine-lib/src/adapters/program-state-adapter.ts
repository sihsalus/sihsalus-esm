import { type OpenmrsResource } from '@openmrs/esm-framework/src/internal';
import dayjs from 'dayjs';
import { type FormContextProps } from '../provider/form-provider';
import {
  type FormField,
  type FormFieldValueAdapter,
  type FormProcessorContextProps,
  type PatientProgram,
  type ValueAndDisplay,
} from '../types';
import { clearSubmission, isPlainObject } from '../utils/common-utils';
import { isEmpty } from '../validators/form-validator';

export const ProgramStateAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: unknown, _context: FormContextProps): void {
    clearSubmission(field);
    if (
      getProgramStateUuid(field.meta?.initialValue?.omrsObject) === value ||
      isEmpty(value) ||
      typeof value !== 'string'
    ) {
      return;
    }
    field.meta.submission.newValue = {
      state: value,
      startDate: dayjs().format(),
    };
  },
  getInitialValue: function (
    field: FormField,
    _sourceObject: OpenmrsResource,
    context: FormProcessorContextProps,
  ): string | null {
    const patientPrograms = getPatientPrograms(context.customDependencies?.patientPrograms);
    const program = patientPrograms.find((program) => program.program.uuid === field.questionOptions.programUuid);
    if (program?.states?.length > 0) {
      const currentState = program.states
        .filter((state) => !state.endDate)
        .find((state) => state.state.programWorkflow?.uuid === field.questionOptions.workflowUuid)?.state;
      field.meta = {
        ...(field.meta || {}),
        initialValue: {
          omrsObject: currentState,
        },
      };
      return currentState?.uuid;
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
  getDisplayValue: function (_field: FormField, value: unknown): unknown {
    if (isOpenmrsDisplayable(value)) {
      return value.display;
    }
    return value;
  },
  tearDown: function (): void {
    return;
  },
};

function getPatientPrograms(value: unknown): PatientProgram[] {
  return Array.isArray(value) ? value.filter(isPatientProgram) : [];
}

function isPatientProgram(value: unknown): value is PatientProgram {
  return (
    isPlainObject(value) &&
    isPlainObject(value.program) &&
    typeof value.program.uuid === 'string' &&
    (!('states' in value) || Array.isArray(value.states))
  );
}

function getProgramStateUuid(value: unknown): string | undefined {
  return isPlainObject(value) && typeof value.uuid === 'string' ? value.uuid : undefined;
}

function isOpenmrsDisplayable(value: unknown): value is OpenmrsResource {
  return isPlainObject(value) && typeof value.display === 'string';
}
