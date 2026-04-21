import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';

export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  slot: 'patient-chart-vacunacion-dashboard-slot',
  moduleName: '@sihsalus/esm-vacunacion-app',
  path: 'Vacunacion',
  title: 'Immunizations',
  icon: 'omrs-icon-syringe',
};
