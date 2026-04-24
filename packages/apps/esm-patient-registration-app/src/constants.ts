import { type OmrsOfflineHttpHeaders, omrsOfflineCachingStrategyHttpHeaderName } from '@openmrs/esm-framework';

export const personRelationshipRepresentation =
  'custom:(display,uuid,' +
  'personA:(age,display,birthdate,uuid),' +
  'personB:(age,display,birthdate,uuid),' +
  'relationshipType:(uuid,display,description,aIsToB,bIsToA))';

export const moduleName = '@sihsalus/esm-patient-registration-app';
export const patientRegistration = 'patient-registration';

export const cacheForOfflineHeaders: OmrsOfflineHttpHeaders = {
  [omrsOfflineCachingStrategyHttpHeaderName]: 'network-first',
};
