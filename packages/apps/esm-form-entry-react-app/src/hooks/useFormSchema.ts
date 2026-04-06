import { type FormSchema } from '@openmrs/esm-form-engine-lib';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

/**
 * Fetches a compiled form schema by form UUID from the O3 forms endpoint.
 */
const useFormSchema = (formUuid: string) => {
  const url = formUuid ? `${restBaseUrl}/o3/forms/${formUuid}` : null;

  const { data, error, isLoading } = useSWR<{ data: FormSchema }>(url, openmrsFetch);

  const schema = data?.data
    ? { ...data.data, encounterType: data.data.encounterType?.['uuid'] ?? data.data.encounterType }
    : undefined;

  return { schema, error, isLoading };
};

export default useFormSchema;
