// hooks/usePrenatalMeasurements.ts
import useSWR from 'swr';
import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import type { ConfigObject } from '../config-schema';

interface PrenatalMeasurement {
  uuid: string;
  date: string;
  gestationalWeek: number;
  uterineHeight?: number;
  cervicalLength?: number;
  encounterUuid: string;
}

interface ObsResponse {
  results: Array<{
    uuid: string;
    obsDatetime: string;
    value: number;
    concept: {
      uuid: string;
      display: string;
    };
    encounter: {
      uuid: string;
    };
  }>;
}

export function usePrenatalMeasurements(patientUuid: string) {
  const config = useConfig<ConfigObject>();

  // Conceptos para mediciones prenatales
  const measurementConcepts = [
    config.concepts?.uterineHeight,
    config.concepts?.cervicalLength,
    config.concepts?.gestationalAge,
  ]
    .filter(Boolean)
    .join(',');

  const { data, error, isLoading, mutate } = useSWR(
    patientUuid && measurementConcepts ? `prenatal-measurements-${patientUuid}` : null,
    () => fetchPrenatalMeasurements(patientUuid, measurementConcepts, config),
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

async function fetchPrenatalMeasurements(
  patientUuid: string,
  conceptUuids: string,
  config: ConfigObject,
): Promise<PrenatalMeasurement[]> {
  // Buscar observaciones de mediciones prenatales
  const encounterTypes = [config.encounterTypes?.prenatalControl].filter(Boolean).join(',');

  const url = `/ws/rest/v1/obs?patient=${patientUuid}&concept=${conceptUuids}&encounterType=${encounterTypes}&v=custom:(uuid,obsDatetime,value,concept:(uuid,display),encounter:(uuid))&limit=100`;

  const response = await openmrsFetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch prenatal measurements');
  }

  const obsData: ObsResponse = await response.json();

  // Agrupar observaciones por encounter
  const encounterGroups = new Map<string, { uuid: string; date: string; encounterUuid: string; observations: Map<string, number> }>();

  obsData.results.forEach((obs) => {
    const encounterUuid = obs.encounter.uuid;
    const conceptUuid = obs.concept.uuid;

    if (!encounterGroups.has(encounterUuid)) {
      encounterGroups.set(encounterUuid, {
        uuid: obs.uuid,
        date: obs.obsDatetime,
        encounterUuid: encounterUuid,
        observations: new Map(),
      });
    }

    encounterGroups.get(encounterUuid).observations.set(conceptUuid, obs.value);
  });

  // Convertir a array de mediciones
  const measurements: PrenatalMeasurement[] = [];

  encounterGroups.forEach((encounter) => {
    const obs = encounter.observations;

    // Calcular semana gestacional
    const gestationalAge = obs.get(config.concepts?.gestationalAge);
    const gestationalWeek = gestationalAge ? Math.floor(gestationalAge / 7) : 0;

    // Solo incluir si tiene al menos una medición válida
    const uterineHeight = obs.get(config.concepts?.uterineHeight);
    const cervicalLength = obs.get(config.concepts?.cervicalLength);

    if (uterineHeight || cervicalLength || gestationalWeek > 0) {
      measurements.push({
        uuid: encounter.uuid,
        date: encounter.date,
        gestationalWeek,
        uterineHeight,
        cervicalLength,
        encounterUuid: encounter.encounterUuid,
      });
    }
  });

  // Ordenar por fecha (más reciente primero)
  return measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Función para invalidar caché
export async function invalidatePrenatalMeasurements(patientUuid: string, mutate: () => Promise<void>) {
  if (mutate) {
    await mutate();
  }
}
