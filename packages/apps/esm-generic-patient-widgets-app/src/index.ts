import { defineExtensionConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';

import { configSchemaSwitchable } from './config-schema-obs-switchable';
import obsSwitchableComponent from './obs-switchable/obs-switchable.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-generic-patient-widgets-app';

const options = {
  featureName: 'Generic widgets',
  moduleName,
};

export const switchableObs = getSyncLifecycle(obsSwitchableComponent, options);

export function startupApp() {
  defineExtensionConfigSchema('obs-by-encounter-widget', configSchemaSwitchable);
}
