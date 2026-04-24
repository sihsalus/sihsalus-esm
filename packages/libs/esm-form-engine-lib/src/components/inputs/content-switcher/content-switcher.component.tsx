import { ContentSwitcher as CdsContentSwitcher, FormGroup, Switch } from '@carbon/react';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormProviderContext } from '../../../provider/form-provider';
import { type FormFieldInputProps, type FormFieldValue } from '../../../types';
import { isTrue } from '../../../utils/boolean-utils';
import { shouldUseInlineLayout } from '../../../utils/form-helper';
import FieldLabel from '../../field-label/field-label.component';
import FieldValueView from '../../value/view/field-value-view.component';
import styles from './content-switcher.scss';

const ContentSwitcher: React.FC<FormFieldInputProps<string | number | null | undefined>> = ({
  field,
  value,
  errors,
  warnings: _warnings,
  setFieldValue,
}) => {
  const { t } = useTranslation();
  const { layoutType, sessionMode, workspaceLayout, formFieldAdapters } = useFormProviderContext();

  const handleChange = useCallback(
    ({ name }: { name: string | number }) => {
      setFieldValue(name);
    },
    [setFieldValue],
  );

  const visibleAnswers = useMemo(
    () => (field.questionOptions.answers ?? []).filter((answer) => !answer.isHidden),
    [field.questionOptions.answers],
  );

  const selectedIndex = useMemo(
    () => visibleAnswers.findIndex((option) => option.concept == value),
    [value, visibleAnswers],
  );

  const isInline = useMemo(() => {
    if (['view', 'embedded-view'].includes(sessionMode) || isTrue(field.readonly)) {
      return shouldUseInlineLayout(field.inlineRendering, layoutType, workspaceLayout, sessionMode);
    }
    return false;
  }, [sessionMode, field.readonly, field.inlineRendering, layoutType, workspaceLayout]);

  return sessionMode == 'view' || sessionMode == 'embedded-view' || isTrue(field.readonly) ? (
    <div className={styles.formField}>
      <FieldValueView
        label={t(field.label)}
        value={
          value
            ? (formFieldAdapters[field.type].getDisplayValue(field, value) as FormFieldValue | string | undefined)
            : value
        }
        conceptName={field.meta?.concept?.display}
        isInline={isInline}
      />
    </div>
  ) : (
    !field.isHidden && (
      <FormGroup
        legendText={
          <div className={styles.boldedLegend}>
            <FieldLabel field={field} />
          </div>
        }
        className={classNames({
          [styles.errorLegend]: errors.length > 0,
          [styles.boldedLegend]: errors.length === 0,
        })}
      >
        <CdsContentSwitcher
          onChange={handleChange}
          selectedIndex={selectedIndex}
          className={styles.selectedOption}
          size="md"
        >
          {visibleAnswers.map((option, index) => (
            <Switch
              name={typeof option.concept === 'string' ? option.concept : index}
              text={t(option.label)}
              key={index}
              disabled={field.isDisabled}
            />
          ))}
        </CdsContentSwitcher>
      </FormGroup>
    )
  );
};

export default ContentSwitcher;
