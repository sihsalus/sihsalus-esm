import { openmrsFetch } from '@openmrs/esm-framework';

export interface EncounterResult {
  uuid: string;
  encounterDatetime: string;
  encounterType: { uuid: string };
}

const BASE_URL = '/ws/rest/v1';
const ENCOUNTER_CUSTOM_REP = 'custom:(uuid,encounterDatetime,encounterType:(uuid))';

export function getEncountersByTypeUrl(patientUuid: string, encounterTypeUuid: string, limit = 100): string {
  return `${BASE_URL}/encounter?patient=${patientUuid}&encounterType=${encounterTypeUuid}&v=${ENCOUNTER_CUSTOM_REP}&limit=${limit}`;
}

export function saveEncounter(payload: {
  patient: string;
  encounterType: string;
  obs: Array<{ concept: string; value: string; comment: string }>;
}): Promise<{ data: unknown }> {
  return openmrsFetch(`${BASE_URL}/encounter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
}

export function updateEncounter(
  encounterUuid: string,
  payload: {
    patient: string;
    encounterType: string;
    obs: Array<{ concept: string; value: string; comment: string }>;
  },
): Promise<{ data: unknown }> {
  return openmrsFetch(`${BASE_URL}/encounter/${encounterUuid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
}
