import { APIRequestContext, Page, test as base } from '@playwright/test';
import { api } from '../fixtures';
import { Patient } from '../commands/types';
import { deletePatient, generateRandomPatient } from '../commands/patient-operations';

// This file sets up our custom test harness using the custom fixtures.
// See https://playwright.dev/docs/test-fixtures#creating-a-fixture for details.
// If a spec intends to use one of the custom fixtures, the special `test` function
// exported from this file must be used instead of the default `test` function
// provided by playwright.

export interface CustomTestFixtures {
  loginAsAdmin: Page;
  patient: Patient;
}

export interface CustomWorkerFixtures {
  api: APIRequestContext;
}

export const test = base.extend<CustomTestFixtures, CustomWorkerFixtures>({
  api: [api, { scope: 'worker' }],

  patient: [
    async ({ api }, use) => {
      const patient = await generateRandomPatient(api);
      console.log('Random patient: ', patient.uuid);
      await use(patient);
      await deletePatient(api, patient.uuid);
    },
    { scope: 'test', auto: true },
  ],
});
