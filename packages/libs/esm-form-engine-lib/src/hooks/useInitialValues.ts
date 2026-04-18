import { useEffect, useState } from 'react';
import { type FormProcessorContextProps } from '../types';
import { type FormProcessor } from '../processors/form-processor';

const useInitialValues = (
  formProcessor: FormProcessor,
  isLoadingContextDependencies: boolean,
  context: FormProcessorContextProps,
): {
  isLoadingInitialValues: boolean;
  initialValues: Record<string, unknown>;
  error: Error | null;
} => {
  const [isLoadingInitialValues, setIsLoadingInitialValues] = useState(true);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (
      formProcessor &&
      !isLoadingContextDependencies &&
      context.formFields?.length &&
      Object.keys(context.formFieldAdapters).length &&
      !Object.keys(initialValues).length
    ) {
      formProcessor
        .getInitialValues(context)
        .then((values: Record<string, unknown>) => {
          setInitialValues(values);
          setIsLoadingInitialValues(false);
        })
        .catch((error: unknown) => {
          console.error(error);
          setError(error instanceof Error ? error : new Error('Unknown error'));
          setIsLoadingInitialValues(false);
        });
    }
  }, [formProcessor, isLoadingContextDependencies, context, initialValues]);

  return { isLoadingInitialValues, initialValues, error };
};

export default useInitialValues;
