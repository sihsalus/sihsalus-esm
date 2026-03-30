import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import Tutorial from './tutorial/tutorial.component';

const moduleName = '@openmrs/esm-user-onboarding-app';

const options = {
  featureName: 'user-onboarding',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const tutorial = getSyncLifecycle(Tutorial, options);

export const tutorialModal = getAsyncLifecycle(() => import('./tutorial/modal.component'), options);
