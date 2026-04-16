import { useEffect, useState } from 'react';
import { type FormProcessorContextProps } from '../types';
import { type FormProcessor } from '../processors/form-processor';
import { reportError } from '../utils/error-utils';

const useProcessorDependencies = (
  formProcessor: FormProcessor,
  context: Partial<FormProcessorContextProps>,
  setContext: (context: FormProcessorContextProps) => void,
): {
  isLoading: boolean;
  error: Error | null;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    void formProcessor
      .loadDependencies(context, setContext)
      .then(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          const normalizedError = error instanceof Error ? error : new Error('Unknown error');
          setError(normalizedError);
          reportError(normalizedError, 'Encountered error while loading dependencies');
          setIsLoading(false);
        }
      });

    return (): void => {
      ignore = true;
    };
  }, [context, formProcessor, setContext]);

  return { isLoading, error };
};

export default useProcessorDependencies;
