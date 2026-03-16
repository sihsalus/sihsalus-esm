import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { ConfigObject } from '../config-schema';

interface NutritionalAssessmentResult {
  weightForAge: string | null;
  heightForAge: string | null;
  weightForHeight: string | null;
  lastMeasurementDate: string | null;
  isLoading: boolean;
  error: Error | null;
}

function buildObsUrl(patientUuid: string, conceptUuid: string | undefined): string | null {
  if (!patientUuid || !conceptUuid) return null;
  return `${restBaseUrl}/obs?patient=${patientUuid}&concept=${conceptUuid}&v=custom:(uuid,value,obsDatetime,display)&limit=1&sort=desc`;
}

const fetcher = async (url: string) => {
  const response = await openmrsFetch(url);
  return response?.data;
};

function extractObsValue(data: { results?: Array<{ value?: { display?: string } | string | number }> }): string | null {
  const obs = data?.results?.[0];
  if (!obs) return null;
  if (typeof obs.value === 'object' && obs.value?.display) {
    return obs.value.display;
  }
  if (obs.value != null) {
    return String(obs.value);
  }
  return null;
}

function extractObsDate(data: { results?: Array<{ obsDatetime?: string }> }): string | null {
  const obs = data?.results?.[0];
  return obs?.obsDatetime ? dayjs(obs.obsDatetime).format('DD/MM/YYYY') : null;
}

/**
 * Hook para evaluación nutricional infantil (NTS 137):
 * - Peso/Edad (P/E), Talla/Edad (T/E), Peso/Talla (P/T)
 * - Última fecha de medición
 *
 * Usa: config.childNutrition.weightForAgeConceptUuid, heightForAgeConceptUuid, weightForHeightConceptUuid
 */
export function useNutritionalAssessment(patientUuid: string): NutritionalAssessmentResult {
  const config = useConfig<ConfigObject>();
  const cn = config.childNutrition;

  const peUrl = useMemo(() => buildObsUrl(patientUuid, cn?.weightForAgeConceptUuid), [patientUuid, cn?.weightForAgeConceptUuid]);
  const teUrl = useMemo(() => buildObsUrl(patientUuid, cn?.heightForAgeConceptUuid), [patientUuid, cn?.heightForAgeConceptUuid]);
  const ptUrl = useMemo(() => buildObsUrl(patientUuid, cn?.weightForHeightConceptUuid), [patientUuid, cn?.weightForHeightConceptUuid]);

  const { data: peData, isLoading: peLoading, error: peError } = useSWR(peUrl, fetcher);
  const { data: teData, isLoading: teLoading, error: teError } = useSWR(teUrl, fetcher);
  const { data: ptData, isLoading: ptLoading, error: ptError } = useSWR(ptUrl, fetcher);

  const result = useMemo(() => {
    const weightForAge = extractObsValue(peData);
    const heightForAge = extractObsValue(teData);
    const weightForHeight = extractObsValue(ptData);

    const dates = [extractObsDate(peData), extractObsDate(teData), extractObsDate(ptData)].filter(Boolean);
    const lastMeasurementDate = dates.length > 0 ? dates[0] : null;

    return { weightForAge, heightForAge, weightForHeight, lastMeasurementDate };
  }, [peData, teData, ptData]);

  return {
    ...result,
    isLoading: peLoading || teLoading || ptLoading,
    error: peError || teError || ptError,
  };
}

export default useNutritionalAssessment;
