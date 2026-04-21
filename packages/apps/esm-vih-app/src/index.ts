import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

import { createDashboardGroup } from './clinical-view-group/createDashboardGroup';
import { configSchema } from './config-schema';

// Case Management
import CaseEncounterOverviewComponent from './case-management/encounters/case-encounter-overview.component';
import EndRelationshipWorkspace from './case-management/workspace/case-management-workspace.component';
import CaseManagementForm from './case-management/workspace/case-management.workspace';
import WrapComponent from './case-management/wrap/wrap.component';

// Specialized Clinics
import GenericDashboard from './specialized-clinics/generic-nav-links/generic-dashboard.component';
import GenericNavLinks from './specialized-clinics/generic-nav-links/generic-nav-links.component';
import DefaulterTracing from './specialized-clinics/hiv-care-and-treatment-services/defaulter-tracing/defaulter-tracing.component';
import {
  defaulterTracingDashboardMeta,
  hivCareAndTreatmentNavGroup,
  htsDashboardMeta,
} from './specialized-clinics/hiv-care-and-treatment-services/hiv-care-and-treatment-dashboard.meta';
import HivTestingEncountersList from './specialized-clinics/hiv-care-and-treatment-services/hiv-testing-services/views/hiv-testing/hiv-testing-services.component';
import { specialClinicsNavGroup } from './specialized-clinics/special-clinic-dashboard.meta';

// Dashboard metas from atencion-ambulatoria config (reused here)
import { createLeftPanelLink } from './left-panel-link.component';

const moduleName = '@sihsalus/esm-vih-app';
const options = {
  featureName: 'vih-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp(): void {
  defineConfigSchema(moduleName, configSchema);
}

// ================================================================================
// CASE MANAGEMENT EXPORTS
// ================================================================================
export const caseManagementDashboardLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'case-management',
    title: 'Seguimiento de Pacientes',
  }),
  options,
);
export const caseEncounterDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...{
      icon: 'omrs-icon-group',
      slot: 'patient-chart-case-encounter-slot',
      columns: 1,
      title: 'Case Encounter',
      path: 'case-encounter-dashboard',
      config: {},
    },
    moduleName,
  }),
  options,
);
export const caseEncounterTable = getSyncLifecycle(CaseEncounterOverviewComponent, options);
export const caseManagementForm = getSyncLifecycle(CaseManagementForm, options);
export const endRelationshipWorkspace = getSyncLifecycle(EndRelationshipWorkspace, options);
export const wrapComponent = getSyncLifecycle(WrapComponent, options);

// ================================================================================
// SPECIALIZED CLINICS / HIV EXPORTS
// ================================================================================
export const specialClinicsSideNavGroup = getSyncLifecycle(createDashboardGroup(specialClinicsNavGroup), options);
export const genericDashboard = getSyncLifecycle(GenericDashboard, options);
export const genericNavLinks = getSyncLifecycle(GenericNavLinks, options);
export const hivCareAndTreatMentSideNavGroup = getSyncLifecycle(
  createDashboardGroup(hivCareAndTreatmentNavGroup),
  options,
);
export const defaulterTracing = getSyncLifecycle(DefaulterTracing, options);
export const defaulterTracingLink = getSyncLifecycle(
  createDashboardLink({ ...defaulterTracingDashboardMeta, moduleName }),
  options,
);
export const htsClinicalView = getSyncLifecycle(HivTestingEncountersList, options);
export const htsDashboardLink = getSyncLifecycle(createDashboardLink({ ...htsDashboardMeta, moduleName }), options);
