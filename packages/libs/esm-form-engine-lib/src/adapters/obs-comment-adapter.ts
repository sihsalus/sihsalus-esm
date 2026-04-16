import { type OpenmrsResource } from '@openmrs/esm-framework';
import { type FormContextProps } from '../provider/form-provider';
import { type FormField, type FormFieldValueAdapter, type FormProcessorContextProps } from '../types';
import { hasSubmission, isFormFieldSubmissionValue, isPlainObject, isStringValue } from '../utils/common-utils';
import { isEmpty } from '../validators/form-validator';
import { editObs, hasPreviousObsValueChanged } from './obs-adapter';

export const ObsCommentAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: unknown, context: FormContextProps) {
    if (!isStringValue(field.meta.targetField)) {
      return null;
    }
    const targetField = context.getFormField(field.meta.targetField);
    const targetFieldCurrentValue: unknown = context.methods.getValues(targetField.id);
    const targetFieldInitialObs = targetField.meta.initialValue?.omrsObject as OpenmrsResource;
    const commentValue = isStringValue(value) ? value : null;

    if (isFormFieldSubmissionValue(targetField.meta.submission?.newValue)) {
      if (isEmpty(value) && !isNewSubmissionEffective(targetField, targetFieldCurrentValue)) {
        // clear submission
        targetField.meta.submission.newValue = null;
      } else {
        targetField.meta.submission.newValue.comment = commentValue ?? undefined;
      }
    } else if (!hasSubmission(targetField) && targetFieldInitialObs) {
      if (isEmpty(value) && isEmpty(targetFieldInitialObs.comment)) {
        return null;
      }
      // generate submission
      const newSubmission = editObs(targetField, targetFieldCurrentValue);
      targetField.meta.submission = {
        newValue: {
          ...newSubmission,
          comment: commentValue ?? undefined,
        },
      };
    }
    return null;
  },
  getInitialValue: function (field: FormField, sourceObject: OpenmrsResource, context: FormProcessorContextProps) {
    const encounter = sourceObject ?? context.domainObjectValue;
    if (encounter) {
      const targetFieldId = field.id.split('_obs_comment')[0];
      const targetField = context.formFields.find((field) => field.id === targetFieldId);
      const initialValue: unknown = targetField?.meta.initialValue?.omrsObject;
      const comment = isPlainObject(initialValue) ? initialValue['comment'] : undefined;
      return isStringValue(comment) ? comment : null;
    }
    return null;
  },
  getPreviousValue: function (
    _field: FormField,
    _sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): null {
    return null;
  },
  getDisplayValue: function (_field: FormField, value: string): string {
    return value;
  },
  tearDown: function (): void {
    return;
  },
};

export function isNewSubmissionEffective(targetField: FormField, targetFieldCurrentValue: unknown): boolean {
  const currentSubmission = targetField.meta.submission?.newValue;
  return (
    hasPreviousObsValueChanged(targetField, targetFieldCurrentValue) ||
    (isFormFieldSubmissionValue(currentSubmission) && !isEmpty(currentSubmission.obsDatetime))
  );
}
