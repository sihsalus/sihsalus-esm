export const htsDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-hts-dashboard-slot',
  columns: 1,
  title: 'HIV Testing Services',
  path: 'hts-dashboard',
} as const;

export const defaulterTracingDashboardMeta = {
  icon: 'omrs-icon-group',
  slot: 'patient-chart-defaulter-tracing-dashboard-slot',
  columns: 1,
  title: 'Defaulter Tracing',
  path: 'defaulter-tracing-dashboard',
} as const;

export const hivCareAndTreatmentNavGroup = {
  icon: 'omrs-icon-group',
  title: 'HIV Care & Treatment',
  slotName: 'hiv-care-and-treatment-slot',
  isExpanded: false,
  isChild: true,
  showWhenExpression: "enrollment.includes('HIV')",
} as const;
