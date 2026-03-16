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

export const familyHistoryDashboardMeta = {
  icon: 'omrs-icon-pedestrian-family',
  slot: 'patient-chart-family-history-slot',
  columns: 1,
  title: 'Family History',
  path: 'family-history',
  config: {},
} as const;

export const contactListDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-relationships-slot',
  columns: 1,
  title: 'Contact List',
  path: 'contact-list',
  config: {},
} as const;

export const otherRelationshipsDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-relationships-slot',
  columns: 1,
  title: 'Other Relationships',
  path: 'other-relationships',
  config: {},
} as const;

export const relationshipsDashboardMeta = {
  icon: 'omrs-icon-pedestrian-family',
  slot: 'patient-chart-relationships-slot',
  columns: 1,
  title: 'Relaciones',
  path: 'relationships',
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
