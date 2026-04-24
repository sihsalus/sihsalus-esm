import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type FormSchema } from '@sihsalus/esm-form-engine-lib';
import useSWR from 'swr';

interface FormSchemaResponse {
  data: FormSchema;
}

type FormField = {
  questionOptions: {
    concept?: string;
    answers?: Array<{ concept: string } & Record<string, unknown>>;
  };
  questions?: FormField[];
} & Record<string, unknown>;

type FormSection = {
  questions: FormField[];
} & Record<string, unknown>;

type FormPage = {
  sections: FormSection[];
  subform?: {
    form: FormSchema;
  } & Record<string, unknown>;
} & Record<string, unknown>;

// Some local/dev form definitions still reference concept UUIDs that do not
// exist in the current backend dictionary. Normalizing them here keeps the
// workspace2 runtime aligned with esm-form-engine-app and avoids encounter POST
// failures for otherwise valid forms.
const legacyConceptCompatibilityMap: Record<string, string> = {
  '5219AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '71b58cff-879b-4358-98d5-2165434d4324',
  '160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  '159615AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': 'c4010006-0000-4000-8000-000000000006',
  '1271AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  '1651AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  '1282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  '1272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
};

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

  const rawPages = response.data.pages as Array<unknown> | undefined;
  const pages = Array.isArray(rawPages)
    ? rawPages.map((page) => {
        const typedPage = page as FormPage;
        const sections = Array.isArray(typedPage.sections)
          ? typedPage.sections.map((section) => ({
              ...section,
              questions: section.questions.map(normalizeField),
            }))
          : typedPage.sections;

        return {
          ...typedPage,
          sections,
          subform: typedPage.subform
            ? {
                ...typedPage.subform,
                form: normalizeSchema({ data: typedPage.subform.form }) ?? typedPage.subform.form,
              }
            : typedPage.subform,
        };
      })
    : rawPages;

  return {
    ...response.data,
    encounterType: normalizeEncounterType(response.data.encounterType as unknown),
    pages,
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
