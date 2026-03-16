import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { LegendConfigObject } from '../types';
import type { Concept } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface ConceptWithColour extends Concept {
  colour?: string;
}

interface ConceptResponse {
  results: Concept[];
}

interface UseSchemasConceptSetResult {
  schemasConceptSet?: ConceptWithColour;
  isLoading: boolean;
  error?: Error;
}

// Adapter function to make openmrsFetch compatible with SWR
const swrFetcher = async (url: string) => {
  const response = await openmrsFetch<ConceptResponse>(url);
  return response.data;
};

export function useSchemasConceptSet(config: LegendConfigObject): UseSchemasConceptSetResult {
  const conceptRepresentation =
    'custom:(uuid,display,answers:(uuid,display),conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';

  const url = `${restBaseUrl}/concept?references=${config.legendConceptSet}&v=${conceptRepresentation}`;

  const { data, error, isLoading } = useSWR<ConceptResponse, Error>(url, swrFetcher);

  const schemasConceptSet = data?.results[0]
    ? {
        ...data.results[0],
        colour: config.colorDefinitions.find((def) => def.conceptUuid === data.results[0].uuid)?.colour,
      }
    : undefined;

  return {
    schemasConceptSet,
    isLoading,
    error,
  };
}
