import { type DashboardLinkConfig } from '@openmrs/esm-patient-common-lib';

export const dashboardMeta: DashboardLinkConfig & { slot: string } = {
  moduleName: '@sihsalus/esm-patient-attachments-app',
  slot: 'patient-chart-attachments-dashboard-slot',
  path: 'Attachments',
  title: 'Attachments',
  icon: 'omrs-icon-document-attachment',
};
