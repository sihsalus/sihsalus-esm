import React, { useEffect } from 'react';
import { useFormProviderContext } from '../../../provider/form-provider';
import { type FormFieldInputProps, type FormFieldValue } from '../../../types';
import {
  isDateValue,
  isOpenmrsObsLike,
  isPatientIdentifierValue,
  isPlainObject,
  isStringOrNumber,
} from '../../../utils/common-utils';
import { isEmpty } from '../../../validators/form-validator';

const FixedValue: React.FC<FormFieldInputProps<FormFieldValue | undefined>> = ({ field, setFieldValue }) => {
  const context = useFormProviderContext();

  useEffect(() => {
    const fixedValue = field.meta?.fixedValue;
    if (!field.meta?.initialValue?.omrsObject && isFormFieldValue(fixedValue) && !isEmpty(fixedValue)) {
      setFieldValue(fixedValue);
      context.formFieldAdapters[field.type].transformFieldValue(field, fixedValue, context);
    }
  }, [context, field, setFieldValue]);

  return <></>;
};

function isFormFieldValue(value: unknown): value is FormFieldValue {
  return (
    value === null ||
    typeof value === 'boolean' ||
    isStringOrNumber(value) ||
    isDateValue(value) ||
    isOpenmrsObsLike(value) ||
    isPatientIdentifierValue(value) ||
    (Array.isArray(value) &&
      value.every(
        (item) =>
          item === null ||
          typeof item === 'boolean' ||
          isStringOrNumber(item) ||
          isDateValue(item) ||
          isPlainObject(item),
      )) ||
    isPlainObject(value)
  );
}

export default FixedValue;
