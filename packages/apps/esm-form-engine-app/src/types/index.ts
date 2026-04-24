import { type OpenmrsResource } from '@openmrs/esm-framework';
import { type OpenmrsFormResource } from '@sihsalus/esm-form-engine-lib';

export interface Form {
  uuid: string;
  encounterType?: OpenmrsResource;
  name: string;
  display?: string;
  version: string;
  published: boolean;
  retired: boolean;
  resources: Array<OpenmrsFormResource>;
  formCategory?: string;
}
