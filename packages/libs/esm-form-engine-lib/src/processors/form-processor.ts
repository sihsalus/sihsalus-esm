import { type OpenmrsResource } from '@openmrs/esm-framework/src/internal';
import { type FormContextProps } from '../provider/form-provider';
import { type FormField, type FormProcessorContextProps, type FormSchema, type ValueAndDisplay } from '../types';

export type FormProcessorConstructor = new (...args: ConstructorParameters<typeof FormProcessor>) => FormProcessor;

export type GetCustomHooksResponse = {
  useCustomHooks: (context: Partial<FormProcessorContextProps>) => {
    data: unknown;
    isLoading: boolean;
    error: unknown;
    updateContext: (setContext: React.Dispatch<React.SetStateAction<FormProcessorContextProps>>) => void;
  };
};

export abstract class FormProcessor {
  formJson: FormSchema;
  domainObjectValue?: OpenmrsResource;

  constructor(formJson: FormSchema) {
    this.formJson = formJson;
  }

  getDomainObject(): OpenmrsResource | undefined {
    return this.domainObjectValue;
  }

  async loadDependencies(
    _context: Partial<FormProcessorContextProps>,
    _setContext: React.Dispatch<React.SetStateAction<FormProcessorContextProps>>,
  ): Promise<Record<string, unknown>> {
    return Promise.resolve({});
  }

  abstract getHistoricalValue(field: FormField, context: FormContextProps): Promise<ValueAndDisplay>;
  abstract processSubmission(context: FormContextProps, abortController: AbortController): Promise<OpenmrsResource>;
  abstract getInitialValues(context: FormProcessorContextProps): Promise<Record<string, unknown>>;
  abstract getCustomHooks(): GetCustomHooksResponse;
  abstract prepareFormSchema(schema: FormSchema): FormSchema;
}
