import { type FormField, type FormFieldValidator } from '../types';
import { isEmpty } from '../validators/form-validator';

interface ConditionalAnsweredConfig {
  referenceQuestionId?: string;
  referenceQuestionAnswers?: string[];
  values?: Record<string, unknown>;
  formFields?: FormField[];
  message?: string;
}

export const conditionalAnsweredValidator: FormFieldValidator = {
  validate: function (field: FormField, value: unknown, config?: unknown) {
    const {
      referenceQuestionId,
      referenceQuestionAnswers = [],
      values = {},
      formFields = [],
      message = '',
    } = (config ?? {}) as ConditionalAnsweredConfig;

    const referencedField = formFields.find((field) => field.id === referenceQuestionId);
    const referencedFieldValue = referencedField ? values[referencedField.id] : undefined;

    if (
      !isEmpty(value) &&
      typeof referencedFieldValue === 'string' &&
      !referenceQuestionAnswers.includes(referencedFieldValue)
    ) {
      return [{ resultType: 'error', errCode: 'invalid.valueSelected', message: message }];
    }

    return [];
  },
};
