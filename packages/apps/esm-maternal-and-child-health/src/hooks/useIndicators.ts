import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useCallback } from 'react';

const BASE_URL = '/ws/module/indicators/api/indicators';

// ===================== TYPES =====================

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

// ===================== READ HOOKS (SWR) =====================

/**
 * Lista todos los indicadores clínicos definidos.
 * GET /ws/module/indicators/api/indicators
 */
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

/**
 * Obtiene un indicador por ID.
 * GET /ws/module/indicators/api/indicators/{id}
 */
export function useIndicator(id: number | null) {
  const { data, isLoading, error, mutate } = useSWR<{ data: IndicatorDefinition }>(
    id != null ? `${BASE_URL}/${id}` : null,
    openmrsFetch,
  );

  return {
    indicator: data?.data ?? null,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Evalúa un indicador y devuelve el conteo de pacientes.
 * GET /ws/module/indicators/api/indicators/{id}/evaluate
 */
export function useEvaluateIndicator(id: number | null) {
  const { data, isLoading, error, mutate } = useSWR<{ data: EvaluationResult }>(
    id != null ? `${BASE_URL}/${id}/evaluate` : null,
    openmrsFetch,
  );

  return {
    result: data?.data ?? null,
    patientCount: data?.data?.patientCount ?? 0,
    isLoading,
    error,
    mutate,
  };
}

// ===================== MUTATION FUNCTIONS =====================

/**
 * Crea un nuevo indicador.
 * POST /ws/module/indicators/api/indicators
 */
export async function createIndicator(
  indicator: Omit<IndicatorDefinition, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const response = await openmrsFetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  });
  return response.data as IndicatorDefinition;
}

/**
 * Actualiza un indicador existente.
 * PUT /ws/module/indicators/api/indicators/{id}
 */
export async function updateIndicator(
  id: number,
  indicator: Partial<IndicatorDefinition>,
) {
  const response = await openmrsFetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  });
  return response.data as IndicatorDefinition;
}

/**
 * Elimina un indicador.
 * DELETE /ws/module/indicators/api/indicators/{id}
 */
export async function deleteIndicator(id: number) {
  const response = await openmrsFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return response.data;
}

// ===================== CONVENIENCE HOOK =====================

/**
 * Hook combinado con acciones CRUD + mutate automático.
 * Uso:
 *   const { indicators, create, remove, refresh } = useIndicatorsCRUD();
 *   await create({ name: 'Mi Indicador', conceptIds: [1234], ... });
 */
export function useIndicatorsCRUD() {
  const { indicators, totalCount, isLoading, error, mutate } = useIndicators();

  const create = useCallback(
    async (indicator: Omit<IndicatorDefinition, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  return {
    indicators,
    totalCount,
    isLoading,
    error,
    create,
    update,
    remove,
    refresh: mutate,
  };
}
