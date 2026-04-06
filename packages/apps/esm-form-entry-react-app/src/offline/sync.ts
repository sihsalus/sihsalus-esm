import { getFullSynchronizationItems, queueSynchronizationItem, type SyncItem } from '@openmrs/esm-framework';

import type { PatientFormSyncItemContent } from '../types';

// The synchronization handler which actually synchronizes the queued items lives in `esm-patient-forms-app`.
// See that module's offline code for the synchronization logic.

export const patientFormSyncItem = 'patient-form';

export async function queuePatientFormSyncItem(content: PatientFormSyncItemContent) {
  await queueSynchronizationItem(patientFormSyncItem, content, {
    id: content._id,
    displayName: 'Patient form',
    patientUuid: content._payloads.encounterCreate?.patient,
    dependencies: [
      {
        type: 'visit',
        id: content._payloads.encounterCreate?.visit,
      },
    ],
  });
}

export async function findQueuedPatientFormSyncItemByContentId(
  id: string,
): Promise<SyncItem<PatientFormSyncItemContent> | undefined> {
  const syncItems = await getFullSynchronizationItems<PatientFormSyncItemContent>(patientFormSyncItem);
  return syncItems.find((item) => item.content._id === id);
}
