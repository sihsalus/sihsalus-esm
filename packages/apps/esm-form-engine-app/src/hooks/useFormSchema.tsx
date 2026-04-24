import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type FormSchema } from '@sihsalus/esm-form-engine-lib';
import useSWR from 'swr';

interface FormSchemaResponse {
  data: FormSchema;
}

interface UseFormSchemaResult {
  schema: FormSchema | null;
  error: Error | undefined;
  isLoading: boolean;
}

type FormField = FormSchema['pages'][number]['sections'][number]['questions'][number];

// Compatibility map for legacy/broken concept UUIDs still present in some O3 form
// definitions on the local dev backend. Without this remap, encounter POSTs fail
// server-side because those concept UUIDs do not exist in this dictionary.
const legacyConceptCompatibilityMap: Record<string, string> = {
  '5219AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '71b58cff-879b-4358-98d5-2165434d4324', // Motivo de consulta
  '160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Texto de la nota de encuentro
  '159615AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': 'c4010006-0000-4000-8000-000000000006', // Plan de intervencion
  '1271AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Observacion de texto generica
  '1651AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Observacion de texto generica
  '1282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Observacion de texto generica
  '1272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Observacion de texto generica
};

function normalizeField(field: FormField): FormField {
  const nextField = { ...field, questionOptions: { ...field.questionOptions } };
  const concept = nextField.questionOptions.concept;

  if (concept && legacyConceptCompatibilityMap[concept]) {
    nextField.questionOptions.concept = legacyConceptCompatibilityMap[concept];
  }

  if (nextField.questionOptions.answers?.length) {
    nextField.questionOptions.answers = nextField.questionOptions.answers.map((answer) => ({
      ...answer,
      concept: legacyConceptCompatibilityMap[answer.concept] ?? answer.concept,
    }));
  }

  if (nextField.questions?.length) {
    nextField.questions = nextField.questions.map(normalizeField);
  }

  return nextField;
}

export function normalizeSchema(schema: FormSchema): FormSchema {
  return {
    ...schema,
    pages: schema.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        questions: section.questions.map(normalizeField),
      })),
      subform: page.subform
        ? {
            ...page.subform,
            form: normalizeSchema(page.subform.form),
          }
        : page.subform,
    })),
  };
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
  const schema = formSchema ? normalizeSchema(formSchema) : null;

  return { schema, error, isLoading };
};

export default useFormSchema;
