import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWRImmutable from 'swr/immutable';
import { useMemo } from 'react';

export interface ConceptReferenceRange {
  lowAbsolute: number | null;
  hiAbsolute: number | null;
  lowNormal: number | null;
  hiNormal: number | null;
  lowCritical: number | null;
  hiCritical: number | null;
  units: string;
}

/**
 * Fetches patient-specific concept reference ranges in a single batched API call.
 * Uses the same pattern as openmrs-esm-patient-chart's useVitalsConceptMetadata.
 * Returns a Record keyed by concept UUID for O(1) lookups.
 */
export function useConceptReferenceRanges(patientUuid: string, conceptUuids: string[]) {
  const conceptParam = useMemo(() => conceptUuids.toSorted().join(','), [conceptUuids]);

  const apiUrl =
    patientUuid && conceptParam
      ? `${restBaseUrl}/conceptreferencerange?patient=${patientUuid}&concept=${conceptParam}&v=custom:(concept,lowAbsolute,hiAbsolute,lowNormal,hiNormal,lowCritical,hiCritical,units)`
      : null;

  interface ConceptReferenceRangeResponse {
    concept: string;
    lowAbsolute: number | null;
    hiAbsolute: number | null;
    lowNormal: number | null;
    hiNormal: number | null;
    lowCritical: number | null;
    hiCritical: number | null;
    units: string | null;
  }

  const { data, error, isLoading } = useSWRImmutable<{ data: { results: ConceptReferenceRangeResponse[] } }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const referenceRanges = useMemo(() => {
    const ranges: Record<string, ConceptReferenceRange> = {};
    const results = data?.data?.results;
    if (!results) return ranges;

    for (const item of results) {
      ranges[item.concept] = {
        lowAbsolute: item.lowAbsolute ?? null,
        hiAbsolute: item.hiAbsolute ?? null,
        lowNormal: item.lowNormal ?? null,
        hiNormal: item.hiNormal ?? null,
        lowCritical: item.lowCritical ?? null,
        hiCritical: item.hiCritical ?? null,
        units: item.units ?? '',
      };
    }

    return ranges;
  }, [data]);

  return { referenceRanges, error, isLoading };
}
