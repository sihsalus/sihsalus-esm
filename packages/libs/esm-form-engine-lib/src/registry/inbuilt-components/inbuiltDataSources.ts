import { type OpenmrsResource } from '@openmrs/esm-framework/src/internal';
import { ConceptDataSource } from '../../datasources/concept-data-source';
import { EncounterRoleDataSource } from '../../datasources/encounter-role-datasource';
import { LocationDataSource } from '../../datasources/location-data-source';
import { ProviderDataSource } from '../../datasources/provider-datasource';
import { SelectConceptAnswersDatasource } from '../../datasources/select-concept-answers-datasource';
import { type DataSource } from '../../types';
import { type RegistryItem } from '../registry';

/**
 * @internal
 */
export const inbuiltDataSources: Array<RegistryItem<DataSource<OpenmrsResource>>> = [
  {
    name: 'location_datasource',
    component: new LocationDataSource(),
  },
  {
    name: 'drug_datasource',
    component: new ConceptDataSource(),
  },
  {
    name: 'problem_datasource',
    component: new ConceptDataSource(),
  },
  {
    name: 'select_concept_answers_datasource',
    component: new SelectConceptAnswersDatasource(),
  },
  {
    name: 'provider_datasource',
    component: new ProviderDataSource(),
  },
  {
    name: 'encounter_role_datasource',
    component: new EncounterRoleDataSource(),
  },
];

export const validateInbuiltDatasource = (name: string): boolean => {
  return inbuiltDataSources.some((datasource) => datasource.name === name);
};
