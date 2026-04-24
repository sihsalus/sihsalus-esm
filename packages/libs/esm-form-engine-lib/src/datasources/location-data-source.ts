import { type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';
import { BaseOpenMRSDataSource } from './data-source';

interface ResultsResponse<T> {
  results?: T[];
}

export class LocationDataSource extends BaseOpenMRSDataSource {
  constructor() {
    super(`${restBaseUrl}/location?v=custom:(uuid,display)`);
  }

  fetchData(searchTerm: string, config?: Record<string, unknown>, uuid?: string): Promise<OpenmrsResource[]> {
    let apiUrl = this.url;
    const urlParts = apiUrl.split('?');
    if (typeof config?.tag === 'string') {
      apiUrl = `${urlParts[0]}?tag=${config.tag}&${urlParts[1]}`;
    }
    //overwrite url if there's a uuid value, meaning we are in edit mode
    if (uuid) {
      apiUrl = `${urlParts[0]}/${uuid}?${urlParts[1]}`;
    }

    return openmrsFetch<OpenmrsResource | ResultsResponse<OpenmrsResource>>(
      searchTerm ? `${apiUrl}&q=${searchTerm}` : apiUrl,
    ).then(({ data }) => {
      if (hasResults(data)) {
        return data.results ?? [];
      }
      return data ? [data] : [];
    });
  }
}

function hasResults(
  data: OpenmrsResource | ResultsResponse<OpenmrsResource>,
): data is ResultsResponse<OpenmrsResource> {
  return typeof data === 'object' && data !== null && 'results' in data;
}
