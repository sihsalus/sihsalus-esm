// ================================================================================
// IMPORTS
// ================================================================================

// Framework and Common Imports
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
import ContactList from './contact-list/contact-list.component';
import {
  caseEncounterDashboardMeta,
  caseManagementDashboardMeta,
  consultaExternaDashboardMeta,
  contactListDashboardMeta,
  familyHistoryDashboardMeta,
  otherRelationshipsDashboardMeta,
  relationshipsDashboardMeta,
  socialHistoryDashboardMeta,
} from './dashboard.meta';
import { createLeftPanelLink } from './left-panel-link.component';

// Configuration and Schema

// ================================================================================
// CASE MANAGEMENT DOMAIN
// ================================================================================

// ================================================================================
// CLINICAL ENCOUNTERS DOMAIN
// ================================================================================

// ================================================================================
// CONTACT LIST DOMAIN
// ================================================================================
import ContactListForm from './contact-list/contact-list.workspace';

// ================================================================================
// FAMILY HISTORY DOMAIN
// ================================================================================
import FamilyHistory from './family-partner-history/family-history.component';
import FamilyRelationshipForm from './family-partner-history/family-relationship.workspace';

// ================================================================================
// OTHER RELATIONSHIPS DOMAIN
// ================================================================================
import { OtherRelationships } from './other-relationships/other-relationships.component';
import { OtherRelationshipsForm } from './other-relationships/other-relationships.workspace';

// ================================================================================
// RELATIONSHIPS DOMAIN
// ================================================================================
import RelationshipUpdateForm from './relationships/forms/relationships-update-form.workspace';
import BirthDateCalculator from './relationships/modals/birthdate-calculator.modal';
import DeleteRelationshipConfirmDialog from './relationships/modals/delete-relationship-dialog.modal';
import Relationships from './relationships/relationships.component';

// ================================================================================
// SPECIALIZED CLINICS DOMAIN
// ================================================================================
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

// HIV Care & Treatment Services

// ================================================================================
// CONSULTA EXTERNA DOMAIN
// ================================================================================

// ================================================================================
// SOCIAL HISTORY DOMAIN
// ================================================================================

// ================================================================================
// EXPORTS SETUP
// ================================================================================
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-sihsalus-consulta-externa-app';
const options = {
  featureName: 'patient-clinical-view-app',
  moduleName,
};

// ================================================================================
// CONFIGURATION
// ================================================================================
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
// CONTACT LIST EXPORTS
// ================================================================================
export const birthDateCalculator = getSyncLifecycle(BirthDateCalculator, options);
export const contactList = getSyncLifecycle(ContactList, options);
export const contactListForm = getSyncLifecycle(ContactListForm, options);
export const contactListLink = getSyncLifecycle(
  createDashboardLink({ ...contactListDashboardMeta, moduleName }),
  options,
);

// ================================================================================
// FAMILY HISTORY EXPORTS
// ================================================================================
export const familyHistory = getSyncLifecycle(FamilyHistory, options);
export const familyHistoryLink = getSyncLifecycle(
  createDashboardLink({ ...familyHistoryDashboardMeta, moduleName }),
  options,
);
export const familyRelationshipForm = getSyncLifecycle(FamilyRelationshipForm, options);

// ================================================================================
// OTHER RELATIONSHIPS EXPORTS
// ================================================================================
export const otherRelationships = getSyncLifecycle(OtherRelationships, options);
export const otherRelationshipsForm = getSyncLifecycle(OtherRelationshipsForm, options);
export const otherRelationshipsLink = getSyncLifecycle(
  createDashboardLink({ ...otherRelationshipsDashboardMeta, moduleName }),
  options,
);

// ================================================================================
// RELATIONSHIPS EXPORTS
// ================================================================================
export const relationshipDeleteConfirmialog = getSyncLifecycle(DeleteRelationshipConfirmDialog, options);
export const relationships = getSyncLifecycle(Relationships, options);
export const relationshipUpdateForm = getSyncLifecycle(RelationshipUpdateForm, options);
export const relationshipsLink = getSyncLifecycle(
  createDashboardLink({ ...relationshipsDashboardMeta, moduleName }),
  options,
);

// ================================================================================
// SPECIALIZED CLINICS EXPORTS
// ================================================================================
export const specialClinicsSideNavGroup = getSyncLifecycle(createDashboardGroup(specialClinicsNavGroup), options);

// Generic Components
export const genericDashboard = getSyncLifecycle(GenericDashboard, options);
export const genericNavLinks = getSyncLifecycle(GenericNavLinks, options);

// HIV Care & Treatment
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

//TO add to routes.json
export const conditionsFilterWorkspace = getAsyncLifecycle(
  () => import('./ui/conditions-filter/conditions-form.workspace'),
  options,
);

export const conditionFilterDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./ui/conditions-filter/delete-condition.modal'),
  options,
);

// ================================================================================
// GENERIC CONDITIONS COMPONENTS
// ================================================================================
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
