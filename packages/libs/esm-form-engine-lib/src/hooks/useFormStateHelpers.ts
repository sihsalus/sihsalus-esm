import { cloneDeep } from 'lodash-es';
import { type Dispatch, useCallback } from 'react';
import { type Action } from '../components/renderer/form/state';
import { type FormField, type FormSchema } from '../types';
import { updateFormSectionReferences } from '../utils/common-utils';

export function useFormStateHelpers(
  dispatch: Dispatch<Action>,
  formFields: FormField[],
): {
  addFormField: (field: FormField) => void;
  updateFormField: (field: FormField) => void;
  getFormField: (fieldId: string) => FormField | undefined;
  removeFormField: (fieldId: string) => void;
  setInvalidFields: (fields: FormField[]) => void;
  addInvalidField: (field: FormField) => void;
  removeInvalidField: (fieldId: string) => void;
  setForm: (formJson: FormSchema) => void;
  setDeletedFields: (fields: FormField[]) => void;
} {
  const addFormField = useCallback(
    (field: FormField): void => {
      dispatch({ type: 'ADD_FORM_FIELD', value: field });
    },
    [dispatch],
  );
  const updateFormField = useCallback(
    function updateFormField(field: FormField): void {
      if (field.meta.groupId) {
        const group = formFields.find((f) => f.id === field.meta.groupId);
        if (group) {
          group.questions = group.questions.map((child) => {
            if (child.id === field.id) {
              return field;
            }
            return child;
          });
          updateFormField(group);
        }
      }
      dispatch({ type: 'UPDATE_FORM_FIELD', value: cloneDeep(field) });
    },
    [dispatch, formFields],
  );

  const getFormField = useCallback(
    (fieldId: string): FormField | undefined => {
      return formFields.find((field) => field.id === fieldId);
    },
    [formFields],
  );

  const removeFormField = useCallback(
    (fieldId: string): void => {
      dispatch({ type: 'REMOVE_FORM_FIELD', value: fieldId });
    },
    [dispatch],
  );

  const setInvalidFields = useCallback(
    (fields: FormField[]): void => {
      dispatch({ type: 'SET_INVALID_FIELDS', value: fields });
    },
    [dispatch],
  );

  const addInvalidField = useCallback(
    (field: FormField): void => {
      dispatch({ type: 'ADD_INVALID_FIELD', value: field });
    },
    [dispatch],
  );

  const removeInvalidField = useCallback(
    (fieldId: string): void => {
      dispatch({ type: 'REMOVE_INVALID_FIELD', value: fieldId });
    },
    [dispatch],
  );

  const setForm = useCallback(
    (formJson: FormSchema): void => {
      dispatch({ type: 'SET_FORM_JSON', value: updateFormSectionReferences(formJson) });
    },
    [dispatch],
  );

  const setDeletedFields = useCallback(
    (fields: FormField[]): void => {
      dispatch({ type: 'SET_DELETED_FIELDS', value: fields });
    },
    [dispatch],
  );

  return {
    addFormField,
    updateFormField,
    getFormField,
    removeFormField,
    setInvalidFields,
    addInvalidField,
    removeInvalidField,
    setForm,
    setDeletedFields,
  };
}
