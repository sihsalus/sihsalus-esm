import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { ConfigObject } from '../config-schema';

interface FeedingAssessmentResult {
  feedingType: string | null;
  lastAssessmentDate: string | null;
  isBreastfeeding: boolean | null;
  isLoading: boolean;
  error: Error | null;
}

const fetcher = async (url: string) => {
  const response = await openmrsFetch(url);
  return response?.data;
};

/**
 * Hook para evaluación de alimentación infantil:
 * - Tipo de alimentación (evaluación general)
 * - ¿Recibe lactancia materna?
 * - Última fecha de evaluación
 *
 * Usa: config.childNutrition.feedingAssessmentConceptUuid, breastfeedingConceptUuid
 */
export function useFeedingAssessment(patientUuid: string): FeedingAssessmentResult {
  const config = useConfig<ConfigObject>();
  const cn = config.childNutrition;

  const feedingUrl = useMemo(() => {
    if (!patientUuid || !cn?.feedingAssessmentConceptUuid) return null;
    return `${restBaseUrl}/obs?patient=${patientUuid}&concept=${cn.feedingAssessmentConceptUuid}&v=custom:(uuid,value,obsDatetime,display)&limit=1&sort=desc`;
  }, [patientUuid, cn?.feedingAssessmentConceptUuid]);

  const bfUrl = useMemo(() => {
    if (!patientUuid || !cn?.breastfeedingConceptUuid) return null;
    return `${restBaseUrl}/obs?patient=${patientUuid}&concept=${cn.breastfeedingConceptUuid}&v=custom:(uuid,value,obsDatetime,display)&limit=1&sort=desc`;
  }, [patientUuid, cn?.breastfeedingConceptUuid]);

  const { data: feedingData, isLoading: feedingLoading, error: feedingError } = useSWR(feedingUrl, fetcher);
  const { data: bfData, isLoading: bfLoading, error: bfError } = useSWR(bfUrl, fetcher);

  const result = useMemo(() => {
    const feedingObs = feedingData?.results?.[0];
    const bfObs = bfData?.results?.[0];

    let feedingType: string | null = null;
    if (feedingObs) {
      feedingType = typeof feedingObs.value === 'object' && feedingObs.value?.display
        ? feedingObs.value.display
        : feedingObs.value != null ? String(feedingObs.value) : null;
    }

    const lastAssessmentDate = feedingObs?.obsDatetime
      ? dayjs(feedingObs.obsDatetime).format('DD/MM/YYYY')
      : bfObs?.obsDatetime
        ? dayjs(bfObs.obsDatetime).format('DD/MM/YYYY')
        : null;

    let isBreastfeeding: boolean | null = null;
    if (bfObs) {
      const val = typeof bfObs.value === 'object' && bfObs.value?.display
        ? bfObs.value.display
        : String(bfObs.value ?? '');
      isBreastfeeding = val.toLowerCase() === 'sí' || val.toLowerCase() === 'si' || val.toLowerCase() === 'yes';
    }

    return { feedingType, lastAssessmentDate, isBreastfeeding };
  }, [feedingData, bfData]);

  return {
    ...result,
    isLoading: feedingLoading || bfLoading,
    error: feedingError || bfError,
  };
}

export default useFeedingAssessment;
