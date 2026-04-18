import { type FormSchema } from '@sihsalus/esm-form-engine-lib';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface FormSchemaResponse {
  data: FormSchema;
}

interface UseFormSchemaResult {
  schema: FormSchema | null;
  error: Error | undefined;
  isLoading: boolean;
}

/**
 * Custom hook to fetch form schema based on its form UUID.
 *
 * @param formUuid - The UUID of the form to retrieve the schema for
 * @returns An object containing the form schema, error, and loading state
 */
const useFormSchema = (formUuid: string): UseFormSchemaResult => {
  const url = formUuid ? `${restBaseUrl}/o3/forms/${formUuid}` : null;

  const { data, error, isLoading } = useSWR<FormSchemaResponse, Error>(url, openmrsFetch);
  const formSchema = data?.data;
  const schema = formSchema ? { ...formSchema } : null;

  return { schema, error, isLoading };
};

export default useFormSchema;
