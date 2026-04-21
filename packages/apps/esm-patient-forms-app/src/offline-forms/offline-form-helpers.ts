import { getOfflineDb, type DynamicOfflineData } from '@openmrs/esm-framework';
import { type HtmlFormEntryForm } from '@openmrs/esm-patient-common-lib';
import useSWR from 'swr';

import { type Form, type FormEncounterResource } from '../types';

/**
 * Returns whether the given form encounter is valid for offline mode and can be cached.
 * @param form The form encounter.
 */
export function isValidOfflineFormEncounter(form: Form, htmlFormEntryForms: Array<HtmlFormEntryForm>) {
  const isHtmlForm = htmlFormEntryForms.some((htmlForm) => htmlForm.formUuid === form.uuid);
  const hasJsonSchema = form.resources.some(isFormJsonSchema);
  return !isHtmlForm && hasJsonSchema;
}

/**
 * Returns whether a form resource is a valid form JSON schema that can be utilized for the purpose
 * of offline mode.
 * @param formResource A resource of a form.
 */
export function isFormJsonSchema(formResource: FormEncounterResource) {
  return formResource.dataType === 'AmpathJsonSchema' || formResource.name === 'JSON schema';
}

export async function getDynamicFormDataEntriesFor(userId: string): Promise<Array<DynamicOfflineData>> {
  return await getOfflineDb()
    .dynamicOfflineData.where('users')
    .equals(userId)
    .and((entry) => entry.type === 'form')
    .toArray();
}

export async function putDynamicFormDataEntryFor(userId: string, formUuid: string): Promise<void> {
  const db = getOfflineDb();
  const existingEntry = await db.dynamicOfflineData.get({
    type: 'form',
    identifier: formUuid,
  });

  if (!existingEntry) {
    await db.dynamicOfflineData.add({
      users: [userId],
      type: 'form',
      identifier: formUuid,
    });
  } else if (!existingEntry.users.includes(userId)) {
    await db.dynamicOfflineData.update(existingEntry.id!, {
      users: [...existingEntry.users, userId],
    });
  }
}

export async function removeDynamicFormDataEntryFor(userId: string, formUuid: string): Promise<void> {
  const db = getOfflineDb();
  const existingEntry = await db.dynamicOfflineData.get({
    type: 'form',
    identifier: formUuid,
  });

  if (!existingEntry?.users.includes(userId)) {
    return;
  }

  if (existingEntry.users.length > 1) {
    await db.dynamicOfflineData.update(existingEntry.id!, {
      users: existingEntry.users.filter((entryUserId) => entryUserId !== userId),
    });
  } else {
    await db.dynamicOfflineData.delete(existingEntry.id!);
  }
}

export function useDynamicFormDataEntries(userId?: string) {
  return useSWR(userId ? ['dynamicFormEntries', userId] : null, () => getDynamicFormDataEntriesFor(userId!));
}
