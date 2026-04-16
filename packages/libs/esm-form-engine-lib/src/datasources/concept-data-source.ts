import { openmrsFetch, restBaseUrl, type OpenmrsResource } from '@openmrs/esm-framework';
import { BaseOpenMRSDataSource } from './data-source';
import { isEmpty } from '../validators/form-validator';

interface ConceptResource extends OpenmrsResource {
  conceptClass?: OpenmrsResource;
  setMembers?: OpenmrsResource[];
}

interface ConceptResultsResponse {
  results?: ConceptResource[];
}

export class ConceptDataSource extends BaseOpenMRSDataSource {
  constructor() {
    super(`${restBaseUrl}/concept?v=custom:(uuid,display,conceptClass:(uuid,display))`);
  }

  fetchData(searchTerm: string, config?: Record<string, unknown>): Promise<OpenmrsResource[]> {
    const conceptClass = config?.class;
    const conceptUuid = typeof config?.concept === 'string' ? config.concept : '';
    const useSetMembersByConcept = config?.useSetMembersByConcept === true;

    if (isEmpty(conceptClass) && isEmpty(conceptUuid) && !useSetMembersByConcept && isEmpty(searchTerm)) {
      return Promise.resolve<OpenmrsResource[]>([]);
    }

    let searchUrl = `${restBaseUrl}/concept?name=&searchType=fuzzy&v=custom:(uuid,display,conceptClass:(uuid,display))`;
    if (conceptClass) {
      if (typeof conceptClass === 'string') {
        const urlParts = searchUrl.split('searchType=fuzzy');
        searchUrl = `${urlParts[0]}searchType=fuzzy&class=${conceptClass}&${urlParts[1]}`;
      } else {
        const allowedClasses = Array.isArray(conceptClass)
          ? conceptClass.filter((entry): entry is string => typeof entry === 'string')
          : [];
        return openmrsFetch<ConceptResultsResponse>(searchTerm ? `${searchUrl}&q=${searchTerm}` : searchUrl).then(
          ({ data }) =>
            (data.results ?? []).filter((concept) => {
              const classUuid = concept.conceptClass?.uuid;
              return typeof classUuid === 'string' && allowedClasses.includes(classUuid);
            }),
        );
      }
    }

    if (conceptUuid && useSetMembersByConcept) {
      const urlParts = searchUrl.split('?name=&searchType=fuzzy&v=');
      searchUrl = `${urlParts[0]}/${conceptUuid}?v=custom:(uuid,setMembers:(uuid,display))`;
      return openmrsFetch<ConceptResource>(searchTerm ? `${searchUrl}&q=${searchTerm}` : searchUrl).then(
        ({ data }) => data.setMembers ?? [],
      );
    }

    return openmrsFetch<ConceptResultsResponse>(searchTerm ? `${searchUrl}&q=${searchTerm}` : searchUrl).then(
      ({ data }) => data.results ?? [],
    );
  }
}
