import { type OpenmrsResource } from '@openmrs/esm-framework';
import { type FormContextProps } from '../provider/form-provider';
import {
  type FormField,
  type FormFieldValueAdapter,
  type FormProcessorContextProps,
  type ValueAndDisplay,
} from '../types';
import { clearSubmission, isPlainObject, isStringValue } from '../utils/common-utils';
import { isEmpty } from '../validators/form-validator';

export const PatientIdentifierAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: unknown, context: FormContextProps): unknown {
    clearSubmission(field);
    if (!isStringValue(value) || field.meta.initialValue?.refinedValue === value || isEmpty(value)) {
      return null;
    }
    field.meta.submission.newValue = {
      identifier: value,
      identifierType: field.questionOptions.identifierType,
      uuid: getPatientIdentifierUuid(field.meta.initialValue?.omrsObject),
      location: context.location.uuid,
    };
    return field.meta.submission.newValue;
  },
  getInitialValue: function (
    field: FormField,
    _sourceObject: OpenmrsResource,
    context: FormProcessorContextProps,
  ): string | null {
    const latestIdentifier = context.patient?.identifier?.find(
      (identifier) => identifier.type?.coding[0]?.code === field.questionOptions.identifierType,
    );
    field.meta = {
      ...(field.meta || {}),
      initialValue: {
        omrsObject: toOpenmrsIdentifierResource(latestIdentifier),
        refinedValue: latestIdentifier?.value ?? null,
      },
    };
    return latestIdentifier?.value;
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

type FhirIdentifier = NonNullable<fhir.Patient['identifier']>[number];

function toOpenmrsIdentifierResource(identifier: FhirIdentifier | undefined): OpenmrsResource | undefined {
  if (!identifier?.value) {
    return undefined;
  }

  return {
    uuid: identifier.id ?? identifier.value,
    display: identifier.value,
  } as OpenmrsResource;
}

function getPatientIdentifierUuid(value: unknown): string | undefined {
  return isPlainObject(value) && typeof value.uuid === 'string' ? value.uuid : undefined;
}

function isOpenmrsDisplayable(value: unknown): value is OpenmrsResource {
  return isPlainObject(value) && typeof value.display === 'string';
}
