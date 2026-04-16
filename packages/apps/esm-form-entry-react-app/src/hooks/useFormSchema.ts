import { type FormSchema } from '@sihsalus/esm-form-engine-lib';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface FormSchemaResponse {
  data: FormSchema;
}

/**
 * Fetches a compiled form schema by form UUID from the O3 forms endpoint.
 */
const useFormSchema = (formUuid: string) => {
  const url = formUuid ? `${restBaseUrl}/o3/forms/${formUuid}` : null;

  const { data, error, isLoading } = useSWR<FormSchemaResponse, Error>(url, openmrsFetch);
  const schemaError = error instanceof Error ? error : undefined;
  const schema = normalizeSchema(data);

  return { schema, error: schemaError, isLoading };
};

export default useFormSchema;

function normalizeSchema(response: FormSchemaResponse | undefined): FormSchema | undefined {
  if (!response?.data) {
    return undefined;
  }

  return {
    ...response.data,
    encounterType: normalizeEncounterType(response.data.encounterType as unknown),
  };
}

function normalizeEncounterType(encounterType: unknown): FormSchema['encounterType'] {
  if (
    typeof encounterType === 'object' &&
    encounterType !== null &&
    'uuid' in encounterType &&
    typeof encounterType.uuid === 'string'
  ) {
    return encounterType.uuid;
  }

  return encounterType as FormSchema['encounterType'];
}
