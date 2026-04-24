import { TextInput } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormField } from '../../../../form-field-context';

const TextArea: React.FC = () => {
  const { t } = useTranslation();
  const { formField, setFormField } = useFormField();

  return (
    <TextInput
      id="textAreaRows"
      labelText={t('rows', 'Rows')}
      value={formField.questionOptions?.rows ? formField.questionOptions.rows.toString() : ''}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestion = {
          ...formField,
          questionOptions: { ...formField.questionOptions, rows: parseInt(event.target.value, 10) },
        };
        setFormField(updatedQuestion);
      }}
    />
  );
};

export default TextArea;
