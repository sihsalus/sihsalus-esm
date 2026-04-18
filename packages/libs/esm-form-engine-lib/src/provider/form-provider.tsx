import React, { type ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type OpenmrsEncounter, type FormProcessorContextProps } from '../types';
import { type FormSchema, type FormField } from '../types/schema';

export type FormValues = Record<string, unknown>;

export interface FormContextProps extends FormProcessorContextProps {
  methods: UseFormReturn<FormValues>;
  workspaceLayout: 'minimized' | 'maximized';
  isSubmitting?: boolean;
  handleOnValidate?: (valid: boolean) => void;
  handleEncounterCreate?: (encounter: OpenmrsEncounter) => OpenmrsEncounter | void | Promise<OpenmrsEncounter | void>;
  deletedFields: FormField[];
  getFormField?: (field: string) => FormField;
  addFormField?: (field: FormField) => void;
  updateFormField?: (field: FormField) => void;
  removeFormField?: (fieldId: string) => void;
  addInvalidField?: (field: FormField) => void;
  removeInvalidField?: (fieldId: string) => void;
  setInvalidFields?: (fields: FormField[]) => void;
  setForm?: (formJson: FormSchema) => void;
  setDeletedFields?: (fields: FormField[]) => void;
}

export interface FormProviderProps extends FormContextProps {
  children: ReactNode;
}

export const FormContext = React.createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ methods, children, ...contextProps }: FormProviderProps): React.JSX.Element => {
  return <FormContext.Provider value={{ ...contextProps, methods }}>{children}</FormContext.Provider>;
};

export const useFormProviderContext = (): FormContextProps => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('FormProviderContext must be used within a FormProviderContext');
  }

  return context;
};
