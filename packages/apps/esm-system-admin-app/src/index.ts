import { getAsyncLifecycle, defineConfigSchema, registerBreadcrumbs } from '@openmrs/esm-framework';

import { configSchema } from './config-schema';

const moduleName = '@openmrs/esm-system-admin-app';

const options = {
  featureName: 'system-administration',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/system-administration`,
      title: () => Promise.resolve(window.i18next.t('systemAdmin', 'System Administration')),
      parent: `${window.spaBase}/home`,
    },
  ]);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const systemAdminAppMenuLink = getAsyncLifecycle(
  () => import('./system-admin-app-menu-link.component'),
  options,
);

export const legacySystemAdminPageCardLink = getAsyncLifecycle(
  () => import('./dashboard/legacy-admin-page-link.component'),
  options,
);
