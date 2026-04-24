import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';

import { configSchema } from './config-schema';
import { createLeftPanelLink } from './left-panel-links.component';
import RootComponent from './root.component';

const moduleName = '@sihsalus/esm-coststructure-app';

const options = {
  featureName: 'cost-structure',
  moduleName,
};

export const homeLeftPanelLink = getSyncLifecycle(
  createLeftPanelLink({ name: '', title: 'Estructura de costos' }),
  options,
);

export const addLeftPanelLink = getSyncLifecycle(createLeftPanelLink({ name: 'add', title: 'Crear' }), options);

export const reportLeftPanelLink = getSyncLifecycle(createLeftPanelLink({ name: 'report', title: 'Resumen' }), options);

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getSyncLifecycle(RootComponent, options);
