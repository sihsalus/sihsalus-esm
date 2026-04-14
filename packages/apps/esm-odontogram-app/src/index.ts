import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

import { configSchema } from './config-schema';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-odontogram-app';

const dashboardMeta = {
  slot: 'patient-chart-odontogram-slot',
  columns: 1,
  title: 'Odontograma',
  path: 'odontogram',
  icon: 'omrs-icon-clinical',
  isLink: true,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// Standalone dev page
export const root = getAsyncLifecycle(() => import('./root.component'), {
  featureName: 'odontogram-root',
  moduleName,
});

// Nav link (renders inside special-clinics-slot)
export const odontogramDashboardLink = getSyncLifecycle(createDashboardLink({ ...dashboardMeta, moduleName }), {
  featureName: 'odontogram-dashboard-link',
  moduleName,
});

// Dashboard card shown when the nav link is clicked
export const odontogramWidget = getAsyncLifecycle(
  () => import('./odontogram-dashboard/odontogram-dashboard.component'),
  {
    featureName: 'odontogram-widget',
    moduleName,
  },
);

export const odontogramWorkspace = getAsyncLifecycle(
  () => import('./odontogram-workspace/odontogram-workspace.component'),
  {
    featureName: 'odontogram-form-workspace',
    moduleName,
  },
);
