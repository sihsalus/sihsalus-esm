import { useEffect, useState } from 'react';
import { getRegisteredFieldValueAdapter } from '../registry/registry';
import { type FormField, type FormFieldValueAdapter } from '../types';

export const useFormFieldValueAdapters = (fields: FormField[]): Record<string, FormFieldValueAdapter> => {
  const [adapters, setAdapters] = useState<Record<string, FormFieldValueAdapter>>({});

  useEffect(() => {
    const supportedTypes = new Set<string>();
    fields.forEach((field) => {
      supportedTypes.add(field.type);
    });
    const supportedTypesArray = Array.from(supportedTypes);
    void Promise.all(supportedTypesArray.map((type) => getRegisteredFieldValueAdapter(type))).then((adapters) => {
      const adaptersByType = Object.fromEntries(
        supportedTypesArray.map((type, index) => [type, adapters[index]]),
      ) as Record<string, FormFieldValueAdapter>;
      setAdapters(adaptersByType);
    });
  }, [fields]);

  return adapters;
};
