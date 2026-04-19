import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

import { configSchema } from './config-schema';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-odontologia-app';

const attentionDashboardMeta = {
  slot: 'patient-chart-odontologia-slot',
  columns: 1,
  title: 'Atención odontológica',
  path: 'atencion-odontologica',
  icon: 'omrs-icon-clipboard',
  isLink: true,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// Standalone dev page
export const root = getAsyncLifecycle(() => import('./root.component'), {
  featureName: 'odontologia-root',
  moduleName,
});

export const odontologiaAttentionDashboardLink = getSyncLifecycle(createDashboardLink({ ...attentionDashboardMeta, moduleName }), {
  featureName: 'odontologia-attention-dashboard-link',
  moduleName,
});

export const odontologiaAttentionDashboard = getAsyncLifecycle(
  () => import('./odontologia-dashboard/odontologia-dashboard.component'),
  {
    featureName: 'odontologia-attention-dashboard',
    moduleName,
  },
);

export const odontologiaOdontogramWorkspace = getAsyncLifecycle(
  () => import('./odontogram-workspace/odontogram-workspace.component'),
  {
    featureName: 'odontologia-odontogram-form-workspace',
    moduleName,
  },
);
