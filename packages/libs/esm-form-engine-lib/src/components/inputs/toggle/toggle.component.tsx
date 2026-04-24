import { Toggle as ToggleInput } from '@carbon/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormProviderContext } from '../../../provider/form-provider';
import { type FormFieldInputProps, type FormFieldValue } from '../../../types';
import { isTrue } from '../../../utils/boolean-utils';
import { shouldUseInlineLayout } from '../../../utils/form-helper';
import { isEmpty } from '../../../validators/form-validator';
import FieldValueView from '../../value/view/field-value-view.component';
import styles from './toggle.scss';

const Toggle: React.FC<FormFieldInputProps<boolean | null | undefined>> = ({
  field,
  value,
  errors: _errors,
  warnings: _warnings,
  setFieldValue,
}) => {
  const { t } = useTranslation();
  const context = useFormProviderContext();

  const handleChange = useCallback(
    (nextValue: boolean): void => {
      setFieldValue(nextValue);
    },
    [setFieldValue],
  );

  useEffect((): void => {
    const { sessionMode, formFieldAdapters } = context;

    if (!field.meta?.initialValue?.omrsObject && sessionMode == 'enter') {
      formFieldAdapters[field.type]?.transformFieldValue(field, value ?? false, context);
    }
  }, [context, field, value]);

  const isInline = useMemo(() => {
    if (['view', 'embedded-view'].includes(context.sessionMode) || isTrue(field.readonly)) {
      return shouldUseInlineLayout(
        field.inlineRendering,
        context.layoutType,
        context.workspaceLayout,
        context.sessionMode,
      );
    }
    return false;
  }, [context.layoutType, context.sessionMode, context.workspaceLayout, field.inlineRendering, field.readonly]);

  return context.sessionMode == 'view' || context.sessionMode == 'embedded-view' ? (
    <FieldValueView
      label={t(field.label)}
      value={
        !isEmpty(value)
          ? (context.formFieldAdapters[field.type]?.getDisplayValue(field, value) as
              | FormFieldValue
              | string
              | undefined)
          : value
      }
      conceptName={field.meta?.concept?.display}
      isInline={isInline}
    />
  ) : (
    !field.isHidden && (
      <div className={styles.boldedLabel}>
        <ToggleInput
          labelText={t(field.label)}
          className={styles.boldedLabel}
          id={field.id}
          labelA={field.questionOptions.toggleOptions.labelFalse}
          labelB={field.questionOptions.toggleOptions.labelTrue}
          onToggle={handleChange}
          toggled={!!value}
          disabled={field.isDisabled}
          readOnly={isTrue(field.readonly)}
        />
      </div>
    )
  );
};

export default Toggle;
