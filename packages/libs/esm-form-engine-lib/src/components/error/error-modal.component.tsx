import { InlineNotification } from '@carbon/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ValidationResult } from '../../types';
import { fieldOutOfBoundErrCode, fieldRequiredErrCode } from '../../validators/form-validator';
import styles from './error.scss';

const ErrorModal: React.FC<{ errors: ValidationResult[] }> = ({ errors }) => {
  const { t } = useTranslation();

  const errorMessage = useMemo(() => {
    const errorMessages: { [key: string]: string } = {};

    errors.forEach((error) => {
      if (error?.errCode === fieldRequiredErrCode && !errorMessages[fieldRequiredErrCode]) {
        errorMessages[fieldRequiredErrCode] = t('nullMandatoryField', 'Please fill the required fields');
      } else if (error?.errCode === fieldOutOfBoundErrCode && !errorMessages[fieldOutOfBoundErrCode]) {
        errorMessages[fieldOutOfBoundErrCode] = t('valuesOutOfBound', 'Some of the values are out of bounds');
      }
    });

    return Object.values(errorMessages).join(', ');
  }, [errors, t]);

  return (
    <InlineNotification
      role="alert"
      className={styles.inlineErrorMessage}
      kind="error"
      lowContrast={true}
      title={t('fieldErrorDescriptionTitle', 'Validation Errors')}
      subtitle={errorMessage}
    />
  );
};

export default ErrorModal;
