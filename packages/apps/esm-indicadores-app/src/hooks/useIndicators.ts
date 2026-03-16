import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useCallback } from 'react';

const BASE_URL = '/ws/module/indicators/api/indicators';

export interface IndicatorDefinition {
  id: number;
  name: string;
  description: string;
  conceptIds: number[];
  minAge: number | null;
  maxAge: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface IndicatorListResponse {
  results: IndicatorDefinition[];
  totalCount: number;
}

interface EvaluationResult {
  indicatorId: number;
  indicatorName: string;
  patientCount: number;
}

/** GET /ws/module/indicators/api/indicators */
export function useIndicators() {
  const { data, isLoading, error, mutate } = useSWR<{ data: IndicatorListResponse }>(
    BASE_URL,
    openmrsFetch,
  );
  return {
    indicators: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate,
  };
}

/** GET /ws/module/indicators/api/indicators/{id}/evaluate */
export function useEvaluateIndicator(id: number | null) {
  const { data, isLoading, error, mutate } = useSWR<{ data: EvaluationResult }>(
    id != null ? `${BASE_URL}/${id}/evaluate` : null,
    openmrsFetch,
  );
  return {
    patientCount: data?.data?.patientCount ?? 0,
    indicatorName: data?.data?.indicatorName ?? '',
    isLoading,
    error,
    mutate,
  };
}

/** POST create */
export async function createIndicator(indicator: Partial<IndicatorDefinition>) {
  const res = await openmrsFetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  });
  return res.data as IndicatorDefinition;
}

/** PUT update */
export async function updateIndicator(id: number, indicator: Partial<IndicatorDefinition>) {
  const res = await openmrsFetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  });
  return res.data as IndicatorDefinition;
}

/** DELETE */
export async function deleteIndicator(id: number) {
  const res = await openmrsFetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return res.data;
}

/** Hook CRUD combinado */
export function useIndicatorsCRUD() {
  const { indicators, totalCount, isLoading, error, mutate } = useIndicators();

  const create = useCallback(
    async (indicator: Partial<IndicatorDefinition>) => {
      const result = await createIndicator(indicator);
      await mutate();
      return result;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: number, changes: Partial<IndicatorDefinition>) => {
      const result = await updateIndicator(id, changes);
      await mutate();
      return result;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteIndicator(id);
      await mutate();
    },
    [mutate],
  );

  return { indicators, totalCount, isLoading, error, create, update, remove, refresh: mutate };
}
