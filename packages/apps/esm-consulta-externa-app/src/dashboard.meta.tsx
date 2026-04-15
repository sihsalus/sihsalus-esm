export const ClinicalDashboardGroup = {
  icon: 'omrs-icon-clinical',
  title: 'Otros Servicios',
  slotName: 'patient-clinical-view-slot',
  isExpanded: false,
} as const;

export const defaulterTracingDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-defaulter-tracing-dashboard-slot',
  columns: 1,
  title: 'Defaulter Tracing',
  path: 'defaulter-tracing-dashboard',
  config: {},
} as const;

export const htsDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-hts-dashboard-slot',
  columns: 1,
  title: 'HTS',
  path: 'hts-dashboard',
  config: {},
} as const;

export const caseManagementDashboardMeta = {
  name: 'case-management',
  slot: 'case-management-dashboard-slot',
  title: 'Seguimiento de Pacientes',
  path: 'case-management',
  columns: 1,
  config: {},
} as const;

export const caseEncounterDashboardMeta = {
  icon: 'omrs-icon-user-follow',
  slot: 'patient-chart-case-encounter-slot',
  columns: 1,
  title: 'Seguimiento del Paciente',
  path: 'case-management-encounters',
  config: {},
} as const;

export const consultaExternaDashboardMeta = {
  icon: 'omrs-icon-document',
  slot: 'patient-chart-consulta-externa-slot',
  columns: 1,
  title: 'Consulta Externa',
  path: 'consulta-externa',
  config: {},
} as const;

export const socialHistoryDashboardMeta = {
  icon: 'omrs-icon-sticky-note-add',
  slot: 'patient-chart-social-history-dashboard-slot',
  columns: 1,
  title: 'Historia Social',
  path: 'social-history-dashboard',
  config: {},
} as const;
