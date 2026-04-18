import {
  type Encounter,
  type Visit,
  type Workspace2DefinitionProps,
  type DefaultWorkspaceProps,
} from '@openmrs/esm-framework';

import { type OpenmrsEncounter } from '@sihsalus/esm-form-engine-lib';

import { type HtmlFormEntryForm } from '../types';

export interface FormEntryProps {
  encounterUuid?: string;
  visitUuid?: string;
  formUuid: string;
  visitTypeUuid?: string;
  visitStartDatetime?: string;
  visitStopDatetime?: string;
  htmlForm?: HtmlFormEntryForm;
  preFilledQuestions?: Record<string, string | number | Date | boolean | Array<string>>;
  additionalProps?: Record<string, unknown>;
}

export interface FormRendererProps {
  additionalProps?: Record<string, unknown>;
  encounterUuid?: string;
  formUuid: string;
  patientUuid: string;
  patient: fhir.Patient;
  visit?: Visit;
  visitUuid?: string;
  hideControls?: boolean;
  hidePatientBanner?: boolean;
  handlePostResponse?: (encounter?: Encounter) => void;
  handleEncounterCreate?: (encounter: OpenmrsEncounter) => OpenmrsEncounter | void | Promise<OpenmrsEncounter | void>;
  handleOnValidate?: (valid: boolean) => void;
  showDiscardSubmitButtons?: boolean;
  preFilledQuestions?: Record<string, string | number | Date | boolean | Array<string>>;
  launchChildWorkspace?: Workspace2DefinitionProps['launchChildWorkspace'];
  closeWorkspace?: DefaultWorkspaceProps['closeWorkspace'];
  closeWorkspaceWithSavedChanges?: () => void;
  setHasUnsavedChanges?(hasUnsavedChanges: boolean): void;
}
