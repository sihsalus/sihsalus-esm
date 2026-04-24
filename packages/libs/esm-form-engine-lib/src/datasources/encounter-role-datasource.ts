import { type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';
import { BaseOpenMRSDataSource } from './data-source';

interface ResultsResponse<T> {
  results?: T[];
}

const encounterRoleRepresentation = 'v=custom:(uuid,display,name)';

export class EncounterRoleDataSource extends BaseOpenMRSDataSource {
  constructor() {
    super(`${restBaseUrl}/encounterrole?${encounterRoleRepresentation}`);
  }

  async fetchData(searchTerm: string, _config?: Record<string, unknown>): Promise<OpenmrsResource[]> {
    const url = `${restBaseUrl}/encounterrole?${encounterRoleRepresentation}`;
    const { data } = await openmrsFetch<ResultsResponse<OpenmrsResource>>(searchTerm ? `${url}&q=${searchTerm}` : url);
    return data.results ?? [];
  }
}
