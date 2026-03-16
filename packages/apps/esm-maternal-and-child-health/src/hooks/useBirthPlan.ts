import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { ConfigObject } from '../config-schema';

interface BirthPlanResult {
  hasBirthPlan: boolean;
  planDate: string | null;
  transportArranged: boolean;
  referenceHospital: string | null;
  encounterUuid: string | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

/**
 * Hook para plan de parto según NTS 105-MINSA:
 * - Toda gestante debe tener plan de parto a partir de la semana 32
 * - Incluye: transporte, acompañante, referencia, fondo de emergencia
 * - Form Ampath: formsList.birthPlanForm (OBST-004-FICHA PLAN DE PARTO)
 * - Encounter type: config.birthPlan.encounterTypeUuid
 *
 * Usa: config.birthPlan.encounterTypeUuid para buscar encounters existentes
 */
export function useBirthPlan(patientUuid: string): BirthPlanResult {
  const config = useConfig<ConfigObject>();
  const encounterTypeUuid = config.birthPlan?.encounterTypeUuid;
  const transportConceptUuid = config.birthPlan?.transportConceptUuid;
  const referenceHospitalConceptUuid = config.birthPlan?.referenceHospitalConceptUuid;

  const url = useMemo(() => {
    if (!patientUuid || !encounterTypeUuid) return null;
    return `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=custom:(uuid,encounterDatetime,obs:(uuid,concept:(uuid),value:(uuid,display),display))&limit=1&order=desc`;
  }, [patientUuid, encounterTypeUuid]);

  const { data, isLoading, error, mutate } = useSWR(
    url,
    async (fetchUrl: string) => {
      const response = await openmrsFetch(fetchUrl);
      return response?.data;
    },
  );

  const result = useMemo(() => {
    const encounter = data?.results?.[0];
    if (!encounter) {
      return {
        hasBirthPlan: false,
        planDate: null,
        transportArranged: false,
        referenceHospital: null,
        encounterUuid: null,
      };
    }

    const obs = encounter.obs ?? [];

    // Transport: Coded concept — check if obs exists (any answer means transport is arranged)
    const transportObs = transportConceptUuid
      ? obs.find((o: { concept?: { uuid: string }; value?: { display?: string; uuid?: string }; display?: string }) => o.concept?.uuid === transportConceptUuid)
      : undefined;
    const transportArranged = !!transportObs;

    // Reference hospital: Text concept — extract display value
    const hospitalObs = referenceHospitalConceptUuid
      ? obs.find((o: { concept?: { uuid: string }; value?: { display?: string; uuid?: string }; display?: string }) => o.concept?.uuid === referenceHospitalConceptUuid)
      : undefined;
    const referenceHospital = hospitalObs?.value?.display ?? hospitalObs?.display?.split(': ')?.[1] ?? null;

    return {
      hasBirthPlan: true,
      planDate: encounter.encounterDatetime ? dayjs(encounter.encounterDatetime).format('DD/MM/YYYY') : null,
      transportArranged,
      referenceHospital,
      encounterUuid: encounter.uuid,
    };
  }, [data, transportConceptUuid, referenceHospitalConceptUuid]);

  return {
    ...result,
    isLoading,
    error,
    mutate,
  };
}

export default useBirthPlan;
