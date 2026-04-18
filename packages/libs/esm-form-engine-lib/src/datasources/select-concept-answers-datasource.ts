import { openmrsFetch, type OpenmrsResource, restBaseUrl } from '@openmrs/esm-framework';
import { BaseOpenMRSDataSource } from './data-source';

interface ConceptAnswersResponse extends OpenmrsResource {
  setMembers?: OpenmrsResource[];
  answers?: OpenmrsResource[];
}

export class SelectConceptAnswersDatasource extends BaseOpenMRSDataSource {
  constructor() {
    super(
      `${restBaseUrl}/concept/:conceptUuid?v=custom:(uuid,display,setMembers:(uuid,display),answers:(uuid,display))`,
    );
  }

  fetchSingleItem(uuid: string): Promise<OpenmrsResource | null> {
    return openmrsFetch<OpenmrsResource>(this.buildUrl(uuid)).then(({ data }) => data);
  }

  fetchData(_searchTerm: string, config?: Record<string, unknown>): Promise<OpenmrsResource[]> {
    const conceptUuid =
      typeof config?.referencedValue === 'string'
        ? config.referencedValue
        : typeof config?.concept === 'string'
          ? config.concept
          : '';
    return openmrsFetch<ConceptAnswersResponse>(this.buildUrl(conceptUuid)).then(({ data }) => {
      return (data.setMembers?.length ? data.setMembers : data.answers) ?? [];
    });
  }

  private buildUrl(conceptUuid: string): string {
    return this.url.replace(':conceptUuid', conceptUuid);
  }
}
