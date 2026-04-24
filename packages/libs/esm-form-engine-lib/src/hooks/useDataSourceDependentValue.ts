import { useWatch } from 'react-hook-form';
import { useFormProviderContext } from '../provider/form-provider';
import { type FormField } from '../types';
import { isPlainObject } from '../utils/common-utils';

type QuestionOptionsWithConfig = FormField['questionOptions'] & {
  config?: {
    referencedField?: string;
  };
};

const useDataSourceDependentValue = (field: FormField): unknown => {
  const questionOptions = field.questionOptions as QuestionOptionsWithConfig;
  const dependentField =
    isPlainObject(questionOptions.config) && typeof questionOptions.config.referencedField === 'string'
      ? questionOptions.config.referencedField
      : undefined;
  const {
    methods: { control },
  } = useFormProviderContext();

  return useWatch({ control, name: dependentField, exact: true, disabled: !dependentField });
};

export default useDataSourceDependentValue;
