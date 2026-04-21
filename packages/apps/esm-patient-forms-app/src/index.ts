import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  subscribePrecacheStaticDependencies,
  syncAllDynamicOfflineData,
} from '@openmrs/esm-framework';
import { registerWorkspace } from '@openmrs/esm-framework/src/internal';

import clinicalFormActionMenuComponent from './clinical-form-action-menu.component';
import { configSchema } from './config-schema';
import OfflineForms from './offline-forms/offline-forms.component';
import { setupDynamicFormDataHandler, setupPatientFormSync } from './offline';

const moduleName = '@sihsalus/esm-patient-forms-app';

const options = {
  featureName: 'patient-forms',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const startupKey = Symbol.for('sihsalus.esm-patient-forms-app.startup-complete');

export function startupApp() {
  const globalScope = globalThis as typeof globalThis & { [startupKey]?: boolean };
  if (globalScope[startupKey]) {
    return;
  }

  globalScope[startupKey] = true;

  defineConfigSchema(moduleName, configSchema);

  if (typeof registerWorkspace === 'function') {
    registerWorkspace({
      name: 'patient-form-entry-workspace',
      title: 'Clinical form',
      type: 'clinical-form',
      canHide: false,
      canMaximize: true,
      width: 'extra-wide',
      component: 'patientFormEntryWorkspace',
      moduleName,
      load: patientFormEntryWorkspace,
    });

    registerWorkspace({
      name: 'clinical-forms-workspace',
      title: 'Clinical forms',
      type: 'clinical-form',
      canHide: true,
      canMaximize: true,
      width: 'extra-wide',
      component: 'clinicalFormsWorkspace',
      moduleName,
      load: clinicalFormsWorkspace,
    });
  }

  setupPatientFormSync();
  setupDynamicFormDataHandler();
  subscribePrecacheStaticDependencies(() => syncAllDynamicOfflineData('form'));
}

// t('clinicalForm', 'Clinical form')
export const patientFormEntryWorkspace = getAsyncLifecycle(() => import('./forms/form-entry.workspace'), options);

export const patientHtmlFormEntryWorkspace = getAsyncLifecycle(
  () => import('./htmlformentry/html-form-entry.workspace'),
  options,
);

export const clinicalFormsWorkspace = getAsyncLifecycle(() => import('./forms/forms-dashboard.workspace'), options);
export const clinicalFormsWorkspaceExtension = getAsyncLifecycle(
  () => import('./forms/forms-dashboard.workspace'),
  options,
);

export const clinicalFormActionMenu = getSyncLifecycle(clinicalFormActionMenuComponent, options);

export const clinicalFormActionButton = getAsyncLifecycle(
  () => import('./clinical-form-action-button.component'),
  options,
);

export const offlineFormOverviewCard = getAsyncLifecycle(
  () => import('./offline-forms/offline-forms-overview-card.component'),
  options,
);

export const offlineFormsNavLink = getAsyncLifecycle(
  () =>
    import('./offline-forms/offline-tools-nav-link.component').then(
      (mod) => mod.default({ page: 'forms', title: 'Offline forms' }) as never,
    ),
  options,
);

export const offlineForms = getSyncLifecycle(OfflineForms, options);
