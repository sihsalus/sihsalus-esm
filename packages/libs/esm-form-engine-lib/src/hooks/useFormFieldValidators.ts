import { useEffect, useState } from 'react';
import { getRegisteredValidator } from '../registry/registry';
import { type FormField, type FormFieldValidator } from '../types';

export function useFormFieldValidators(fields: FormField[]): Record<string, FormFieldValidator> | undefined {
  const [validators, setValidators] = useState<Record<string, FormFieldValidator>>();

  useEffect(() => {
    const supportedTypes = new Set<string>();
    fields.forEach((field) => {
      field.validators?.forEach((validator) => supportedTypes.add(validator.type));
    });
    const supportedTypesArray = Array.from(supportedTypes);
    void Promise.all(supportedTypesArray.map((type) => getRegisteredValidator(type))).then((validators) => {
      const validatorsByType = Object.fromEntries(
        validators.map((validator, index) => [supportedTypesArray[index], validator]),
      ) as Record<string, FormFieldValidator>;
      setValidators(validatorsByType);
    });
  }, [fields]);

  return validators;
}
