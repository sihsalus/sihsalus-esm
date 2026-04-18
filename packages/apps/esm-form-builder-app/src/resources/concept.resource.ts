import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { Concept } from '@types';

export async function fetchConceptById(uuid: string) {
  const url = `${restBaseUrl}/concept/${uuid}?v=full`;
  return await openmrsFetch<Concept>(url);
}
