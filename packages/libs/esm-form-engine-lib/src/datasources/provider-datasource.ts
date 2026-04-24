import { type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';
import { BaseOpenMRSDataSource } from './data-source';

interface ResultsResponse<T> {
  results?: T[];
}

const providerRepresentation = 'v=custom:(uuid,display)';

export class ProviderDataSource extends BaseOpenMRSDataSource {
  constructor() {
    super(`${restBaseUrl}/provider?${providerRepresentation}`);
  }

  async fetchData(searchTerm: string, _config?: Record<string, unknown>): Promise<OpenmrsResource[]> {
    const url = `${restBaseUrl}/provider?${providerRepresentation}`;
    const { data } = await openmrsFetch<ResultsResponse<OpenmrsResource>>(searchTerm ? `${url}&q=${searchTerm}` : url);
    return data.results ?? [];
  }
}
