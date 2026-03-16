import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

interface TreatmentPlanEntry {
  encounterUuid: string;
  encounterDatetime: string;
  provider: string | null;
  labOrders: string | null;
  procedures: string | null;
  prescriptions: string | null;
  therapeuticIndications: string | null;
  referral: string | null;
  nextAppointment: string | null;
}

interface Obs {
  uuid: string;
  concept: { uuid: string; display: string };
  value: string | { display: string };
}

interface Encounter {
  uuid: string;
  encounterDatetime: string;
  encounterProviders: Array<{ display: string }>;
  obs: Obs[];
}

export function useTreatmentPlan(
  patientUuid: string,
  encounterTypeUuid: string,
  concepts: Record<string, string>,
) {
  const url = patientUuid && encounterTypeUuid
    ? `${restBaseUrl}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=custom:(uuid,encounterDatetime,encounterProviders:(display),obs:(uuid,concept:(uuid,display),value))&limit=20`
    : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: { results: Encounter[] } }>(
    url,
    openmrsFetch,
  );

  const getObsValue = (obs: Obs[] | undefined, conceptUuid: string | undefined): string | null => {
    if (!obs || !conceptUuid) return null;
    const match = obs.find((o) => o.concept?.uuid === conceptUuid);
    if (!match) return null;
    return typeof match.value === 'string' ? match.value : match.value?.display ?? null;
  };

  const treatmentPlans: TreatmentPlanEntry[] = (data?.data?.results ?? [])
    .map((encounter) => ({
      encounterUuid: encounter.uuid,
      encounterDatetime: encounter.encounterDatetime,
      provider: encounter.encounterProviders?.[0]?.display?.split(' - ')?.[0] ?? null,
      labOrders: getObsValue(encounter.obs, concepts?.labOrdersUuid),
      procedures: getObsValue(encounter.obs, concepts?.proceduresUuid),
      prescriptions: getObsValue(encounter.obs, concepts?.prescriptionsUuid),
      therapeuticIndications: getObsValue(encounter.obs, concepts?.therapeuticIndicationsUuid),
      referral: getObsValue(encounter.obs, concepts?.referralUuid),
      nextAppointment: getObsValue(encounter.obs, concepts?.nextAppointmentUuid),
    }))
    .filter(
      (entry) =>
        entry.labOrders ||
        entry.procedures ||
        entry.prescriptions ||
        entry.therapeuticIndications ||
        entry.referral ||
        entry.nextAppointment,
    );

  return {
    treatmentPlans,
    isLoading,
    error,
    mutate,
  };
}
