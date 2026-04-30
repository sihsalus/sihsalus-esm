import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';

export const moduleName = '@sihsalus/esm-patient-medications-app';
export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  moduleName,
  slot: 'patient-chart-medications-dashboard-slot',
  path: 'medications',
  title: 'Medications',
  icon: 'omrs-icon-medication',
};
