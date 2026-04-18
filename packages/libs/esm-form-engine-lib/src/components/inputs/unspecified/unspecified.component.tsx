import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../validators/form-validator';
import { type FormField, type FormFieldValue } from '../../../types';
import { isTrue } from '../../../utils/boolean-utils';

import styles from './unspecified.scss';
import { useFormProviderContext } from '../../../provider/form-provider';
import { clearSubmission, isViewMode } from '../../../utils/common-utils';

interface UnspecifiedFieldProps {
  field: FormField;
  fieldValue: FormFieldValue | undefined;
  setFieldValue: (value: FormFieldValue) => void;
  onAfterChange: (value: FormFieldValue) => void;
}

const UnspecifiedField: React.FC<UnspecifiedFieldProps> = ({ field, fieldValue, setFieldValue, onAfterChange }) => {
  const { t } = useTranslation();
  const [isUnspecified, setIsUnspecified] = useState(false);
  const { sessionMode, updateFormField } = useFormProviderContext();

  useEffect((): void => {
    if (isEmpty(fieldValue) && sessionMode === 'edit') {
      // we assume that the field was previously unspecified
      setIsUnspecified(true);
      if (!field.meta.submission) {
        field.meta.submission = {};
      }
      field.meta.submission.unspecified = true;
    }
  }, [field, fieldValue, sessionMode]);

  useEffect((): void => {
    if (field.meta.submission?.unspecified && (field.meta.submission.newValue || !isEmpty(fieldValue))) {
      setIsUnspecified(false);
      field.meta.submission.unspecified = false;
      updateFormField(field);
    }
  }, [field, fieldValue, updateFormField]);

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean; id: string }): void => {
      const rendering = field.questionOptions.rendering;
      if (data.checked) {
        setIsUnspecified(true);
        const emptyValue: FormFieldValue = rendering === 'checkbox' ? [] : '';
        clearSubmission(field);
        field.meta.submission.unspecified = true;
        // clear stale validation results
        field.meta.submission.errors = [];
        field.meta.submission.warnings = [];
        updateFormField(field);
        setFieldValue(emptyValue);
        onAfterChange(emptyValue);
      } else {
        setIsUnspecified(false);
        field.meta.submission.unspecified = false;
        updateFormField(field);
      }
    },
    [field, onAfterChange, setFieldValue, updateFormField],
  );

  return (
    !field.isHidden &&
    !isTrue(field.readonly) &&
    !isViewMode(sessionMode) && (
      <div className={styles.unspecified}>
        <Checkbox
          id={`${field.id}-unspecified`}
          labelText={t('unspecified', 'Unspecified')}
          value={t('unspecified', 'Unspecified')}
          onChange={handleOnChange}
          checked={isUnspecified}
          disabled={field.isDisabled}
        />
      </div>
    )
  );
};

export default UnspecifiedField;
