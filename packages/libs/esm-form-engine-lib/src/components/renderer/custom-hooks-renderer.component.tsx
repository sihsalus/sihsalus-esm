import { useEffect } from 'react';
import { type FormProcessorContextProps } from '../../types';
import { type GetCustomHooksResponse } from '../../processors/form-processor';

export const CustomHooksRenderer = ({
  context,
  setContext,
  useCustomHooks,
  setIsLoadingCustomHooks,
}: {
  context: FormProcessorContextProps;
  setContext: React.Dispatch<React.SetStateAction<FormProcessorContextProps>>;
  useCustomHooks: GetCustomHooksResponse['useCustomHooks'];
  setIsLoadingCustomHooks: (isLoading: boolean) => void;
}): null => {
  const { isLoading = false, updateContext } = useCustomHooks(context);

  useEffect(() => {
    if (!isLoading && updateContext) {
      updateContext(setContext);
      setIsLoadingCustomHooks(false);
    }
  }, [isLoading, setContext, setIsLoadingCustomHooks, updateContext]);

  return null;
};
