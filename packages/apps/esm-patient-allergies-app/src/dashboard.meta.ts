import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';

export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  moduleName: '@sihsalus/esm-patient-allergies-app',
  slot: 'patient-chart-allergies-dashboard-slot',
  path: 'Allergies',
  title: 'Allergies',
  icon: 'omrs-icon-warning',
};
