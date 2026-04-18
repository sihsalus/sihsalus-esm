import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormField, FormFieldInputProps, RenderType } from '../../types';
import { evaluateAsyncExpression, evaluateExpression } from '../../utils/expression-runner';
import { isEmpty } from '../../validators/form-validator';
import styles from './repeat.scss';
import { cloneRepeatField } from './helpers';
import { clearSubmission, isViewMode } from '../../utils/common-utils';
import RepeatControls from './repeat-controls.component';
import { createErrorHandler } from '@openmrs/esm-framework';
import { useFormProviderContext } from '../../provider/form-provider';
import { FormFieldRenderer } from '../renderer/field/form-field-renderer.component';
import { useFormFactory } from '../../provider/form-factory-provider';

const renderingByTypeMap: Record<string, RenderType> = {
  obsGroup: 'group',
  testOrder: 'select',
  diagnosis: 'ui-select-extended',
};

const Repeat: React.FC<FormFieldInputProps> = ({ field }) => {
  const [counter, setCounter] = useState(0);
  const [rows, setRows] = useState<FormField[]>([]);
  const context = useFormProviderContext();
  const { handleConfirmQuestionDeletion } = useFormFactory();
  const {
    patient,
    sessionMode,
    formFieldAdapters,
    formFields,
    methods: { getValues, setValue },
    addFormField,
    removeFormField,
    deletedFields,
    setDeletedFields,
    visit,
  } = context;

  useEffect((): void => {
    const repeatedFields = formFields.filter(
      (_field) =>
        _field.questionOptions.concept === field.questionOptions.concept &&
        _field.id.startsWith(field.id) &&
        !_field.meta?.repeat?.wasDeleted,
    );
    setCounter(repeatedFields.length - 1);
    setRows(repeatedFields);
  }, [formFields, field]);

  const handleAdd = useCallback(
    (nextCounter: number): void => {
      const clonedFieldsBuffer: FormField[] = [];
      function evaluateExpressions(nextField: FormField): void {
        if (nextField.hide?.hideWhenExpression) {
          nextField.isHidden = Boolean(
            evaluateExpression(
              nextField.hide.hideWhenExpression,
              { value: nextField, type: 'field' },
              [...formFields, ...clonedFieldsBuffer],
              getValues(),
              {
                mode: sessionMode,
                patient,
                visit,
              },
            ),
          );
        }
        if (nextField.questionOptions.calculate?.calculateExpression) {
          void evaluateAsyncExpression(
            nextField.questionOptions.calculate.calculateExpression,
            { value: nextField, type: 'field' },
            [...formFields, ...clonedFieldsBuffer],
            getValues(),
            {
              mode: sessionMode,
              patient,
              visit,
            },
          ).then((result) => {
            if (!isEmpty(result)) {
              setValue(nextField.id, result);
              formFieldAdapters[nextField.type]?.transformFieldValue(nextField, result, context);
            }
          });
        }
      }

      const clonedField = cloneRepeatField(field, null, nextCounter);
      clonedFieldsBuffer.push(clonedField);

      // Handle nested questions
      if (clonedField.type === 'obsGroup') {
        clonedField.questions?.forEach((childField) => {
          clonedFieldsBuffer.push(childField);
        });
      }

      clonedFieldsBuffer.forEach((nextField) => {
        evaluateExpressions(nextField);
        addFormField(nextField);
      });
      setRows((prevRows) => [...prevRows, clonedField]);
    },
    [addFormField, context, field, formFieldAdapters, formFields, getValues, patient, sessionMode, setValue, visit],
  );

  const removeNthRow = useCallback(
    (rowField: FormField): void => {
      if (rowField.meta.initialValue?.omrsObject) {
        formFieldAdapters[rowField.type]?.transformFieldValue(rowField, null, context);
        rowField.meta.repeat = { ...(rowField.meta.repeat || {}), wasDeleted: true };
        if (rowField.type === 'obsGroup') {
          rowField.questions?.forEach((child) => {
            child.meta.repeat = { ...(rowField.meta.repeat || {}), wasDeleted: true };
            formFieldAdapters[child.type]?.transformFieldValue(child, null, context);
          });
        }
      } else {
        clearSubmission(rowField);
      }
      setRows((prevRows) => prevRows.filter((question) => question.id !== rowField.id));
      setDeletedFields([...deletedFields, rowField]);
      removeFormField(rowField.id);
    },
    [context, deletedFields, formFieldAdapters, removeFormField, setDeletedFields],
  );

  const onClickDeleteQuestion = useCallback(
    (rowField: Readonly<FormField>): void => {
      if (handleConfirmQuestionDeletion) {
        void handleConfirmQuestionDeletion(rowField)
          .then(() => removeNthRow(rowField))
          .catch(() => createErrorHandler());
      } else {
        removeNthRow(rowField);
      }
    },
    [handleConfirmQuestionDeletion, removeNthRow],
  );

  const nodes = useMemo(() => {
    return rows.map((rowField, index) => {
      const supportedQuestion = getQuestionWithSupportedRendering(rowField);
      const component = (
        <FormFieldRenderer
          fieldId={rowField.id}
          valueAdapter={formFieldAdapters[rowField.type]}
          repeatOptions={{ targetRendering: supportedQuestion.questionOptions.rendering }}
        />
      );
      return (
        <div key={`${rowField.id}_wrapper`}>
          {index !== 0 && (
            <div>
              <hr className={styles.divider} />
            </div>
          )}
          <div className={styles.nodeContainer}>{component}</div>
          {!isViewMode(sessionMode) && (
            <RepeatControls
              question={rowField}
              rows={rows}
              questionIndex={index}
              handleDelete={() => {
                onClickDeleteQuestion(rowField);
              }}
              handleAdd={() => {
                const nextCount = counter + 1;
                handleAdd(nextCount);
                setCounter(nextCount);
              }}
            />
          )}
        </div>
      );
    });
  }, [counter, formFieldAdapters, handleAdd, onClickDeleteQuestion, rows, sessionMode]);

  if (field.isHidden || !nodes || !hasVisibleField(field)) {
    return null;
  }

  return (
    <React.Fragment>
      <div>{nodes}</div>
    </React.Fragment>
  );
};

function hasVisibleField(field: FormField): boolean {
  if (field.questions?.length) {
    return field.questions.some((child) => !child.isHidden);
  }
  return !field.isHidden;
}

function getQuestionWithSupportedRendering(field: FormField): FormField {
  return {
    ...field,
    questionOptions: {
      ...field.questionOptions,
      rendering: renderingByTypeMap[field.type] ?? field.questionOptions.rendering,
    },
  };
}

export default Repeat;
