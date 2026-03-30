import { defineConfigSchema, getAsyncLifecycle, registerBreadcrumbs } from '@openmrs/esm-framework';
import { getFixedT } from 'i18next';

import { configSchema } from './config-schema';
import { basePath, moduleName } from './constants';

const options = {
  featureName: 'reports',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  const t = getFixedT(undefined, moduleName);

  registerBreadcrumbs([
    {
      title: 'Home',
      path: `${window.getOpenmrsSpaBase().slice(0, -1)}${basePath}`,
    },
    {
      path: `${window.getOpenmrsSpaBase()}system-administration`,
      title: () => Promise.resolve(t('systemAdmin', 'System Administration')),
      parent: `${window.getOpenmrsSpaBase()}home`,
    },
    {
      title: () => Promise.resolve(t('reports', 'Reports')),
      path: `${window.getOpenmrsSpaBase()}reports`,
      parent: `${window.getOpenmrsSpaBase()}system-administration`,
    },
    {
      title: () => Promise.resolve(t('scheduledReports', 'Scheduled Reports')),
      path: `${window.getOpenmrsSpaBase()}reports/scheduled-overview`,
      parent: `${window.getOpenmrsSpaBase()}reports`,
    },
    {
      title: () => Promise.resolve(t('reportsDataOverview', 'Reports Data Overview')),
      path: `${window.getOpenmrsSpaBase()}reports/reports-data-overview`,
      parent: `${window.getOpenmrsSpaBase()}reports`,
    },
  ]);
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./reports.component'), options);

export const reportsLink = getAsyncLifecycle(() => import('./reports-link'), options);

export const overview = getAsyncLifecycle(() => import('./components/overview.component'), options);

export const scheduledOverview = getAsyncLifecycle(() => import('./components/scheduled-overview.component'), options);

export const runReport = getAsyncLifecycle(() => import('./components/run-report/run-report-form.component'), options);

export const cancelReportModal = getAsyncLifecycle(
  () => import('./components/run-report/cancel-report-modal.component'),
  options,
);
