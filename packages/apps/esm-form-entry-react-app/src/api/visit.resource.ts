import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

/**
 * Fetches the visit start/stop times for validation.
 */
export async function getVisitStartStopTime(visitUuid: string) {
  const url = `${restBaseUrl}/visit/${visitUuid}?v=custom:(uuid,startDatetime,stopDatetime)&includeInactive=false`;
  const response = await openmrsFetch(url);
  return response.data as { uuid: string; startDatetime: string; stopDatetime: string | null };
}

/**
 * Updates the visit start and/or stop datetime to accommodate encounter datetime.
 */
export async function updateVisitDates(
  visitUuid: string,
  startDatetime?: string,
  stopDatetime?: string,
) {
  const body: Record<string, string> = {};
  if (startDatetime) {
    body.startDatetime = startDatetime;
  }
  if (stopDatetime) {
    body.stopDatetime = stopDatetime;
  }

  return openmrsFetch(`${restBaseUrl}/visit/${visitUuid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}
