export const consultaExternaDashboardMeta = {
  icon: 'omrs-icon-document',
  slot: 'patient-chart-consulta-externa-slot',
  columns: 1,
  title: 'consultaExterna',
  path: 'consulta-externa',
  tooltip: 'consultaExternaTooltip',
  config: {},
} as const;

export const socialHistoryDashboardMeta = {
  icon: 'omrs-icon-sticky-note-add',
  slot: 'patient-chart-social-history-dashboard-slot',
  columns: 1,
  title: 'socialHistory',
  path: 'social-history-dashboard',
  tooltip: 'socialHistoryTooltip',
  config: {},
} as const;
