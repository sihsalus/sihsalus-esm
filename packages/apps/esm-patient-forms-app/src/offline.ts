import {
  makeUrl,
  messageOmrsServiceWorker,
  omrsOfflineCachingStrategyHttpHeaderName,
  openmrsFetch,
  restBaseUrl,
  setupDynamicOfflineDataHandler,
  setupOfflineSync,
  type SyncProcessOptions,
  type Visit,
} from '@openmrs/esm-framework';
import { launchFormEntry } from '@openmrs/esm-patient-common-lib';
import escapeRegExp from 'lodash-es/escapeRegExp';

/** Types inlined from the former esm-form-entry-app (Angular) to remove the cross-package dependency. */
interface EncounterCreate {
  uuid?: string;
  encounterDatetime: string;
  patient: string;
  encounterType: string;
  location: string;
  encounterProviders?: Array<{ uuid?: string; person: string; provider: string }>;
  obs?: Array<Record<string, unknown>>;
  orders?: Array<Record<string, unknown>>;
  diagnoses?: Array<Record<string, unknown>>;
  form?: string;
  visit?: string;
}

interface PersonUpdate {
  uuid?: string;
  attributes: Array<{ attributeType: string; value: string }>;
}

interface PatientFormSyncItemContent {
  _id: string;
  formSchemaUuid: string;
  encounter: Partial<{ uuid: string; encounterDatetime: string }>;
  _payloads: {
    encounterCreate?: EncounterCreate;
    personUpdate?: PersonUpdate;
  };
}

import { formEncounterUrl, formEncounterUrlPoc } from './constants';
import { type Form } from './types';

const patientFormSyncItem = 'patient-form';

export async function setupPatientFormSync() {
  setupOfflineSync<PatientFormSyncItemContent>(patientFormSyncItem, ['visit'], syncPatientForm, {
    onBeginEditSyncItem(syncItem) {
      launchFormEntry(
        syncItem.content.formSchemaUuid,
        syncItem.descriptor.patientUuid,
        syncItem.content._id,
        'Form Entry',
      );
    },
  });
}

async function syncPatientForm(
  item: PatientFormSyncItemContent,
  options: SyncProcessOptions<PatientFormSyncItemContent>,
) {
  const associatedOfflineVisit: Visit | undefined = options.dependencies[0];
  const {
    _payloads: { encounterCreate, personUpdate },
  } = item;

  await Promise.all([
    syncEncounter(associatedOfflineVisit, encounterCreate),
    syncPersonUpdate(personUpdate?.uuid, personUpdate),
  ]);
}

async function syncEncounter(associatedOfflineVisit: Visit, encounter?: EncounterCreate) {
  if (!encounter) {
    return;
  }

  const body = {
    ...encounter,
    encounterDatetime: encounter.encounterDatetime ?? associatedOfflineVisit?.stopDatetime,
  };

  await openmrsFetch(`${restBaseUrl}/encounter`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body,
  });
}

async function syncPersonUpdate(personUuid?: string, personUpdate?: PersonUpdate) {
  if (!personUuid || !personUpdate) {
    return;
  }

  await openmrsFetch(`${restBaseUrl}/person/${personUuid}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: personUpdate,
  });
}

export async function setupDynamicFormDataHandler() {
  setupDynamicOfflineDataHandler({
    id: 'esm-patient-forms-app:form',
    type: 'form',
    displayName: 'Patient forms',
    async isSynced(identifier) {
      const expectedUrls = await getCacheableFormUrls(identifier);
      const absoluteExpectedUrls = expectedUrls.map((url) => globalThis.location.origin + makeUrl(url));
      const cache = await caches.open('omrs-spa-cache-v1');
      const keys = (await cache.keys()).map((key) => key.url);
      return absoluteExpectedUrls.every((url) => keys.includes(url));
    },
    async sync(identifier) {
      const urlsToCache = await getCacheableFormUrls(identifier);
      const cacheResults = await Promise.allSettled(
        urlsToCache.map(async (urlToCache) => {
          await messageOmrsServiceWorker({
            type: 'registerDynamicRoute',
            pattern: escapeRegExp(urlToCache),
            strategy: 'network-first',
          });

          await openmrsFetch(urlToCache, {
            headers: {
              [omrsOfflineCachingStrategyHttpHeaderName]: 'network-first',
            },
          });
        }),
      );

      if (cacheResults.some((x) => x.status === 'rejected')) {
        throw new Error(`Some form data could not be properly downloaded. (Form UUID: ${identifier})`);
      }
    },
  });
}

async function getCacheableFormUrls(formUuid: string) {
  const getFormRes = await openmrsFetch<Form>(`${restBaseUrl}/form/${formUuid}?v=full`);
  const form = getFormRes.data;

  if (!form) {
    throw new Error(`The form data could not be loaded from the server. (Form UUID: ${formUuid})`);
  }

  return [formEncounterUrl, formEncounterUrlPoc].filter(Boolean);
}
