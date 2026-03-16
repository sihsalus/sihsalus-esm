// index.ts
import type React from 'react';
import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { createDashboardGroup } from './clinical-view-group/createDashboardGroup';
import { configSchema } from './config-schema';

// Maternal and Child Health Components
import {
  labourAndDeliveryDashboardMeta,
  maternalAndChildHealthNavGroup,
  postnatalDashboardMeta,
  prenatalDashboardMeta,
  familyPlanningDashboardMeta,
  cancerPreventionDashboardMeta,
} from './maternal-and-child-health/dashboard.meta';
import { LabourDelivery } from './maternal-and-child-health/labour-delivery.component';
import { PostnatalCare } from './maternal-and-child-health/postnatal-care.component';
import { PrenatalCare } from './maternal-and-child-health/prenatal-care.component';
import { FamilyPlanning } from './maternal-and-child-health/family-planning.component';
import { CancerPrevention } from './maternal-and-child-health/cancer-prevention.component';
import DeliveryOrAbortionTable from './maternal-and-child-health/components/labour-delivery/deliveryOrAbortion.component';
import SummaryOfLaborAndPostpartumTable from './maternal-and-child-health/components/labour-delivery/summaryOfLaborAndPostpartum.component';
import ImmediatePostpartumTable from './maternal-and-child-health/components/postnatal-care/immediatePostpartum.component';
import PostpartumControlTable from './maternal-and-child-health/components/postnatal-care/postpartumControl.component';
import CurrentPregnancyTable from './maternal-and-child-health/components/prenatal-care/currentPregnancy.component';
import MaternalHistoryTable from './maternal-and-child-health/components/prenatal-care/maternalHistory.component';
import PrenatalCareChart from './maternal-and-child-health/components/prenatal-care/prenatalCareChart.component';
import BirthPlanWidget from './maternal-and-child-health/components/prenatal-care/birth-plan/birth-plan.component';
import RiskClassification from './maternal-and-child-health/components/prenatal-care/risk-classification/risk-classification.component';
import PsychoprophylaxisWidget from './maternal-and-child-health/components/prenatal-care/psychoprophylaxis/psychoprophylaxis.component';
import PrenatalSupplementationWidget from './maternal-and-child-health/components/prenatal-care/prenatal-supplementation/prenatal-supplementation.component';
import PostpartumTrackingWidget from './maternal-and-child-health/components/postnatal-care/postpartum-tracking.component';
import PartographChart from './ui/partography/partograph-chart';
import { ObstetricHistoryBase } from './ui/obstetric-history-widget';

// Well Child Care Components
import {
  childImmunizationScheduleDashboardMeta,
  neonatalCareDashboardMeta,
  wellChildCareNavGroup,
  wellChildControlDashboardMeta,
  earlyStimulationDashboardMeta,
  childNutritionDashboardMeta,
} from './well-child-care/dashboard.meta';
import { ChildImmunizationSchedule } from './well-child-care/child-immunization.component';
import { NeonatalCare } from './well-child-care/neonatal-care.component';
import { WellChildControl } from './well-child-care/well-child-control.component';
import { EarlyStimulation } from './well-child-care/early-stimulation.component';
import { ChildNutrition } from './well-child-care/child-nutrition.component';
import AlojamientoConjunto from './well-child-care/components/alojamiento-conjunto';
import CredControlsCheckout from './well-child-care/components/cred-controls-timeline/cred-checkups.component';
import CredControlsMatrix from './well-child-care/components/cred-controls-timeline/cred-matrix.component';
import CredControlsTimeline from './well-child-care/components/cred-controls-timeline/cred-controls-timeline.component';
import BirthDataTable from './well-child-care/components/neonatal-register/detalles-nacimiento/birth-date.component';
import PregnancyBirthTable from './well-child-care/components/neonatal-register/detalles-embarazo/pregnancy-table.component';
import LabourHistory from './well-child-care/components/neonatal-register/labour-history/labour-history.component';
import NeonatalAttention from './well-child-care/components/neonatal-attention/neonatal-attention.component';
import NeonatalCounseling from './well-child-care/components/neonatal-counseling/neonatal-consuling.component';
import NeonatalEvaluation from './well-child-care/components/neonatal-evaluation/neonatal-evaluation.component';
import NewbornBalanceOverview from './well-child-care/components/newborn-monitoring/newborn balance/balance-overview.component';
import NewbornBiometricsBase from './well-child-care/components/newborn-monitoring/newborn biometrics/biometrics-base.component';
import VaccinationSchedule from './well-child-care/components/vaccination-schema-widget/vaccinationSchedule.component';
import AdverseReactionsSummary from './well-child-care/components/adverse-reactions-summary/adverse-reactions-summary.component';
import AnemiaScreening from './well-child-care/components/anemia-screening/anemia-screening.component';
import SupplementationTracker from './well-child-care/components/supplementation/supplementation-tracker.component';
import ScreeningIndicators from './well-child-care/components/screening/screening-indicators.component';
import DevelopmentOverview from './well-child-care/components/development-overview/development-overview.component';
import ChildMedicalHistory from './ui/conditions-filter/conditions-overview.component';
import SlotPlaceholder from './ui/slot-placeholder/slot-placeholder.component';
import PrenatalAntecedents from './well-child-care/components/neonatal-register/prenatal-history/prenatal-history.component';
import CREDFormActionButton from './well-child-care/components/cred-form-action-button.component';

// Family Planning Components
import ContraceptiveMethods from './maternal-and-child-health/components/family-planning/contraceptive-methods/contraceptive-methods.component';
import FpCounseling from './maternal-and-child-health/components/family-planning/fp-counseling/fp-counseling.component';
import FpFollowup from './maternal-and-child-health/components/family-planning/fp-followup/fp-followup.component';

// Cancer Prevention Components
import CervicalScreening from './maternal-and-child-health/components/cancer-prevention/cervical-screening/cervical-screening.component';
import BreastScreening from './maternal-and-child-health/components/cancer-prevention/breast-screening/breast-screening.component';
import CancerFollowup from './maternal-and-child-health/components/cancer-prevention/cancer-followup/cancer-followup.component';

// Child Nutrition Components
import NutritionalAssessment from './well-child-care/components/child-nutrition/nutritional-assessment/nutritional-assessment.component';
import FeedingCounseling from './well-child-care/components/child-nutrition/feeding-counseling/feeding-counseling.component';
import NutritionFollowup from './well-child-care/components/child-nutrition/nutrition-followup/nutrition-followup.component';

// Early Stimulation Components
import StimulationSessions from './well-child-care/components/early-stimulation/stimulation-sessions/stimulation-sessions.component';
import StimulationFollowup from './well-child-care/components/early-stimulation/stimulation-followup/stimulation-followup.component';
import StimulationCounseling from './well-child-care/components/early-stimulation/stimulation-counseling/stimulation-counseling.component';

// Module Configuration
const moduleName = '@sihsalus/esm-maternal-and-child-health-app';
const options = {
  featureName: 'patient-clinical-view-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

// ================================================================================
// CONFIGURATION
// ================================================================================
export function startupApp(): void {
  defineConfigSchema(moduleName, configSchema);
}

// ================================================================================
// MATERNAL AND CHILD HEALTH EXPORTS
// ================================================================================
export const maternalAndChildHealthSideNavGroup = getSyncLifecycle(
  createDashboardGroup(maternalAndChildHealthNavGroup),
  options,
);

// Navigation Links
export const labourAndDeliveryLink = getSyncLifecycle(
  createDashboardLink({ ...labourAndDeliveryDashboardMeta, moduleName }),
  options,
);
export const postnatalCareLink = getSyncLifecycle(
  createDashboardLink({ ...postnatalDashboardMeta, moduleName }),
  options,
);
export const prenatalCareLink = getSyncLifecycle(
  createDashboardLink({ ...prenatalDashboardMeta, moduleName }),
  options,
);
export const familyPlanningLink = getSyncLifecycle(
  createDashboardLink({ ...familyPlanningDashboardMeta, moduleName }),
  options,
);
export const cancerPreventionLink = getSyncLifecycle(
  createDashboardLink({ ...cancerPreventionDashboardMeta, moduleName }),
  options,
);

// Main Components
export const labourAndDelivery = getSyncLifecycle(LabourDelivery, options);
export const postnatalCare = getSyncLifecycle(PostnatalCare, options);
export const prenatalCare = getSyncLifecycle(PrenatalCare, options);
export const familyPlanning = getSyncLifecycle(FamilyPlanning, options);
export const cancerPrevention = getSyncLifecycle(CancerPrevention, options);

// Labour & Delivery Components
export const deliveryOrAbortionTable = getSyncLifecycle(DeliveryOrAbortionTable, options);
export const partograph = getSyncLifecycle(PartographChart, options);
export const summaryOfLaborAndPostpartumTable = getSyncLifecycle(SummaryOfLaborAndPostpartumTable, options);

// Obstetric History
export const obstetricHistoryChart = getSyncLifecycle(ObstetricHistoryBase, options);

// Postnatal Care Components
export const immediatePostpartumTable = getSyncLifecycle(ImmediatePostpartumTable, options);
export const postpartumControlTable = getSyncLifecycle(PostpartumControlTable, options);
export const postpartumTracking = getSyncLifecycle(PostpartumTrackingWidget, options);

// Prenatal Care Components
export const currentPregnancyTable = getSyncLifecycle(CurrentPregnancyTable, options);
export const maternalHistoryTable = getSyncLifecycle(MaternalHistoryTable, options);
export const prenatalCareChart = getSyncLifecycle(PrenatalCareChart, options);
export const birthPlan = getSyncLifecycle(BirthPlanWidget, options);
export const riskClassification = getSyncLifecycle(RiskClassification, options);
export const psychoprophylaxis = getSyncLifecycle(PsychoprophylaxisWidget, options);
export const prenatalSupplementation = getSyncLifecycle(PrenatalSupplementationWidget, options);

// ================================================================================
// WELL CHILD CARE EXPORTS
// ================================================================================
export const wellChildCareSideNavGroup = getSyncLifecycle(createDashboardGroup(wellChildCareNavGroup), options);

// Navigation Links
export const childImmunizationScheduleLink = getSyncLifecycle(
  createDashboardLink({ ...childImmunizationScheduleDashboardMeta, moduleName }),
  options,
);
export const neonatalCareLink = getSyncLifecycle(
  createDashboardLink({ ...neonatalCareDashboardMeta, moduleName }),
  options,
);
export const wellChildCareLink = getSyncLifecycle(
  createDashboardLink({ ...wellChildControlDashboardMeta, moduleName }),
  options,
);
export const earlyStimulationLink = getSyncLifecycle(
  createDashboardLink({ ...earlyStimulationDashboardMeta, moduleName }),
  options,
);
export const childNutritionLink = getSyncLifecycle(
  createDashboardLink({ ...childNutritionDashboardMeta, moduleName }),
  options,
);

// Main Components
export const childImmunizationSchedule = getSyncLifecycle(ChildImmunizationSchedule, options);
export const neonatalCare = getSyncLifecycle(NeonatalCare, options);
export const wellChildCare = getSyncLifecycle(WellChildControl, options);
export const earlyStimulation = getSyncLifecycle(EarlyStimulation, options);
export const childNutrition = getSyncLifecycle(ChildNutrition, options);

// CRED Controls
export const credCheckouts = getSyncLifecycle(CredControlsCheckout, options);
export const credControls = getSyncLifecycle(CredControlsTimeline, options);
export const credControlsMatrix = getSyncLifecycle(CredControlsMatrix, options);

// Neonatal Components
export const alojamientoConjunto = getSyncLifecycle(AlojamientoConjunto, options);
export const neonatalAttentionChart = getSyncLifecycle(NeonatalAttention, options);
export const neonatalCounselingChart = getSyncLifecycle(NeonatalCounseling, options);
export const neonatalEvaluationChart = getSyncLifecycle(NeonatalEvaluation, options);
export const neonatalRegisterBirth = getSyncLifecycle(BirthDataTable, options);
export const neonatalRegisterChart = getSyncLifecycle(LabourHistory, options);
export const pregnancyDetails = getSyncLifecycle(PregnancyBirthTable, options);

// Newborn Monitoring
export const newbornBalanceOverviewChart = getSyncLifecycle(NewbornBalanceOverview, options);
export const newbornBiometricsBaseChart = getSyncLifecycle(NewbornBiometricsBase, options);

// Vaccination Components
export const vaccinationAppointment = getSyncLifecycle(AdverseReactionsSummary, options);
export const adverseReactionFormWorkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/adverse-reaction/adverseReaction.component'),
  options,
);
export const vaccinationSchedule = getSyncLifecycle(VaccinationSchedule, options);

// Child Medical History
export const childMedicalHistory = getSyncLifecycle(ChildMedicalHistory, options);

// CRED Fase 1 — Screening & Supplementation Widgets
export const anemiaScreening = getSyncLifecycle(AnemiaScreening, options);
export const supplementationTracker = getSyncLifecycle(SupplementationTracker, options);
export const screeningIndicators = getSyncLifecycle(ScreeningIndicators, options);

// Development Evaluation Overview
export const developmentOverview = getSyncLifecycle(DevelopmentOverview, options);

// Prenatal History (Obstetric Formula)
export const prenatalHistory = getSyncLifecycle(PrenatalAntecedents, options);

// CRED Form Action Button
export const credFormActionButton = getSyncLifecycle(CREDFormActionButton, options);

// Generic Slot Placeholder (used for empty tabs)
export const slotPlaceholder = getSyncLifecycle(SlotPlaceholder, options);

// Family Planning Widgets
export const contraceptiveMethods = getSyncLifecycle(ContraceptiveMethods, options);
export const fpCounseling = getSyncLifecycle(FpCounseling, options);
export const fpFollowup = getSyncLifecycle(FpFollowup, options);

// Cancer Prevention Widgets
export const cervicalScreening = getSyncLifecycle(CervicalScreening, options);
export const breastScreening = getSyncLifecycle(BreastScreening, options);
export const cancerFollowup = getSyncLifecycle(CancerFollowup, options);

// Child Nutrition Widgets
export const nutritionalAssessment = getSyncLifecycle(NutritionalAssessment, options);
export const feedingCounseling = getSyncLifecycle(FeedingCounseling, options);
export const nutritionFollowup = getSyncLifecycle(NutritionFollowup, options);

// Early Stimulation Widgets
export const stimulationSessions = getSyncLifecycle(StimulationSessions, options);
export const stimulationFollowup = getSyncLifecycle(StimulationFollowup, options);
export const stimulationCounseling = getSyncLifecycle(StimulationCounseling, options);

// ================================================================================
// HIDDEN DASHBOARD ROUTE MARKERS
// These invisible extensions register dashboard routes with the patient chart.
// Without them, the patient chart cannot route to our custom dashboards.
// ================================================================================
const HiddenDashboardMarker: React.FC = () => null;
export const hiddenDashboardMarker = getSyncLifecycle(HiddenDashboardMarker, options);

// ================================================================================
// ASYNC COMPONENTS
// ================================================================================
export const alturaUterinaChart = getAsyncLifecycle(
  () => import('./ui/alturaCuello-chart/altura-cuello-overview.component'),
  options,
);
export const growthChart = getAsyncLifecycle(
  () => import('./ui/growth-chart/growth-chart-overview.component'),
  options,
);
export const monthlyAppointmentFilterCalendar = getAsyncLifecycle(
  () => import('./ui/appointment-filter-calendar/appointment-filter-calendar'),
  options,
);
export const newbornAnthropometricsworkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/newborn-triage/newborn-anthropometrics.workspace'),
  options,
);
export const newbornFluidBalanceworkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/newborn-triage/newborn-fluid-balance.workspace'),
  options,
);
export const perinatalRegisterworkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/perinatal-register/perinatal-register-form.workspace'),
  options,
);
export const schedulingAdminPageCardLink = getAsyncLifecycle(
  () => import('./immunization-plan/scheduling-admin-link.component'),
  options,
);
export const wellchildControlsworkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/well-child-control/well-child-controls-form.workspace'),
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
export const antecedentesPatologicos = getAsyncLifecycle(
  () => import('./well-child-care/antecedentes-patologicos.component'),
  options,
);
export const antecedentesPatologicosFormWorkspace = getAsyncLifecycle(
  () => import('./well-child-care/antecedentes-patologicos-form.workspace'),
  options,
);
export const formsSelectorWorkspace = getAsyncLifecycle(
  () => import('./ui/forms-selector/forms-selector.workspace'),
  options,
);
export const tepsiFormWorkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/tepsi-form/tepsi-form.component'),
  options,
);
export const testPeruanoFormWorkspace = getAsyncLifecycle(
  () => import('./well-child-care/workspace/test-peruano-form/test-peruano-form.component'),
  options,
);
