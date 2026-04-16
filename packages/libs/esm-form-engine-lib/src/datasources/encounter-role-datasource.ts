import { openmrsFetch, restBaseUrl, type OpenmrsResource } from '@openmrs/esm-framework';
import { BaseOpenMRSDataSource } from './data-source';

interface ResultsResponse<T> {
  results?: T[];
}

export class EncounterRoleDataSource extends BaseOpenMRSDataSource {
  constructor() {
    super(null);
  }

  async fetchData(searchTerm: string, _config?: Record<string, unknown>): Promise<OpenmrsResource[]> {
    const rep = 'v=custom:(uuid,display,name)';
    const url = `${restBaseUrl}/encounterrole?${rep}`;
    const { data } = await openmrsFetch<ResultsResponse<OpenmrsResource>>(searchTerm ? `${url}&q=${searchTerm}` : url);
    return data.results ?? [];
  }
}
