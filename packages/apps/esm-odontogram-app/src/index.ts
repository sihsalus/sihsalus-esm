import { getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'odontogram',
  moduleName: '@sihsalus/esm-odontogram-app',
};

const dashboardMeta = {
  slot: 'patient-chart-odontogram-slot',
  columns: 1,
  title: 'Odontogram',
  path: 'odontogram',
  isLink: true,
};

// Standalone dev page
export const root = getAsyncLifecycle(() => import('./root.component'), options);

// Patient Chart integration
export const odontogramDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta, moduleName: options.moduleName }),
  options,
);

export const odontogramWidget = getAsyncLifecycle(
  () => import('./odontogram-workspace/odontogram-workspace.component'),
  options,
);

export const odontogramWorkspace = getAsyncLifecycle(
  () => import('./odontogram-workspace/odontogram-workspace.component'),
  options,
);
