import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

import CaseEncounterOverviewComponent from './case-management/encounters/case-encounter-overview.component';
import EndRelationshipWorkspace from './case-management/workspace/case-management-workspace.component';
import CaseManagementForm from './case-management/workspace/case-management.workspace';
import WrapComponent from './case-management/wrap/wrap.component';
import ClinicalEncounterDashboard from './clinical-encounter/dashboard/clinical-encounter-dashboard.component';
import ClinicalViewSection from './clinical-view-group/clinical-view-section.component';
import { createDashboardGroup } from './clinical-view-group/createDashboardGroup';
import { configSchema } from './config-schema';
import ConsultaExternaDashboard from './consulta-externa/consulta-externa-dashboard.component';
import {
  caseEncounterDashboardMeta,
  caseManagementDashboardMeta,
  consultaExternaDashboardMeta,
  socialHistoryDashboardMeta,
} from './dashboard.meta';
import { createLeftPanelLink } from './left-panel-link.component';
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

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-atencion-ambulatoria-app';
const options = {
  featureName: 'patient-clinical-view-app',
  moduleName,
};

export function startupApp(): void {
  defineConfigSchema(moduleName, configSchema);
}

// ================================================================================
// CASE MANAGEMENT EXPORTS
// ================================================================================
export const caseEncounterDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...caseEncounterDashboardMeta, moduleName }),
  options,
);
export const caseEncounterTable = getSyncLifecycle(CaseEncounterOverviewComponent, options);
export const caseManagementDashboardLink = getSyncLifecycle(createLeftPanelLink(caseManagementDashboardMeta), options);
export const caseManagementForm = getSyncLifecycle(CaseManagementForm, options);
export const endRelationshipWorkspace = getSyncLifecycle(EndRelationshipWorkspace, options);
export const wrapComponent = getSyncLifecycle(WrapComponent, options);

// ================================================================================
// CLINICAL ENCOUNTERS EXPORTS
// ================================================================================
export const clinicalViewPatientDashboard = getSyncLifecycle(ClinicalViewSection, options);
export const inPatientClinicalEncounter = getSyncLifecycle(ClinicalEncounterDashboard, options);

// ================================================================================
// SPECIALIZED CLINICS EXPORTS
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

// ================================================================================
// ASYNC COMPONENTS
// ================================================================================
export const monthlyAppointmentFilterCalendar = getAsyncLifecycle(
  () => import('./ui/appointment-filter-calendar/appointment-filter-calendar'),
  options,
);
export const conditionsFilterWorkspace = getAsyncLifecycle(
  () => import('./ui/conditions-filter/conditions-form.workspace'),
  options,
);
export const conditionFilterDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./ui/conditions-filter/delete-condition.modal'),
  options,
);
export const genericConditionsOverview = getAsyncLifecycle(
  () => import('./ui/conditions-filter/generic-conditions-overview.component'),
  options,
);

// ================================================================================
// CONSULTA EXTERNA EXPORTS
// ================================================================================
export const consultaExternaDashboard = getSyncLifecycle(ConsultaExternaDashboard, options);
export const consultaExternaDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...consultaExternaDashboardMeta, moduleName }),
  options,
);

// ================================================================================
// SOCIAL HISTORY EXPORTS
// ================================================================================
export const socialHistoryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...socialHistoryDashboardMeta, moduleName }),
  options,
);

// ================================================================================
// FORMS SELECTOR (GENERIC WORKSPACE)
// ================================================================================
export const formsSelectorWorkspace = getAsyncLifecycle(
  () => import('./ui/forms-selector/forms-selector.workspace'),
  options,
);
