import { ExtensionSlot, type Visit, usePatient } from '@openmrs/esm-framework';
import {
  clinicalFormsWorkspace,
  type DefaultPatientWorkspaceProps,
  type FormRendererProps,
  type FormEntryProps,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import React, { useMemo } from 'react';

interface FormEntryComponentProps extends DefaultPatientWorkspaceProps {
  mutateForm?: () => void;
  formInfo?: FormEntryProps;
  form?: { uuid: string; name?: string };
  encounterUuid?: string;
  additionalProps?: Record<string, unknown>;
  clinicalFormsWorkspaceName?: string;
}

const FormEntry: React.FC<FormEntryComponentProps> = (props) => {
  const {
    patientUuid,
    clinicalFormsWorkspaceName = clinicalFormsWorkspace,
    mutateForm,
    formInfo,
    form,
    encounterUuid: workspaceEncounterUuid,
    additionalProps: workspaceAdditionalProps,
  } = props;
  const {
    encounterUuid = workspaceEncounterUuid,
    formUuid = form?.uuid,
    visitStartDatetime,
    visitStopDatetime,
    visitTypeUuid,
    visitUuid,
    additionalProps = workspaceAdditionalProps,
  } = formInfo || {};
  const { patient } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const visit = useMemo<Visit | undefined>(() => {
    if (visitUuid && visitStartDatetime) {
      return {
        uuid: visitUuid,
        startDatetime: visitStartDatetime,
        stopDatetime: visitStopDatetime ?? null,
        visitType: visitTypeUuid ? { uuid: visitTypeUuid, display: '' } : undefined,
        encounters: currentVisit?.encounters ?? [],
      };
    }

    return currentVisit;
  }, [currentVisit, visitStartDatetime, visitStopDatetime, visitTypeUuid, visitUuid]);
  const state = useMemo(
    () =>
      ({
        additionalProps,
        closeWorkspace: () => {
          if (typeof mutateForm === 'function') {
            mutateForm();
          }
          props.closeWorkspace();
        },
        closeWorkspaceWithSavedChanges: () => {
          if (typeof mutateForm === 'function') {
            mutateForm();
          }
          props.closeWorkspaceWithSavedChanges();
        },
        encounterUuid: encounterUuid ?? undefined,
        formUuid: formUuid ?? '',
        patient,
        patientUuid: patientUuid ?? '',
        setHasUnsavedChanges: (hasUnsavedChanges: boolean) => {
          props.promptBeforeClosing(() => hasUnsavedChanges);
        },
        visit,
        visitUuid: visit?.uuid,
        clinicalFormsWorkspaceName,
      }) satisfies FormRendererProps & {
        clinicalFormsWorkspaceName: string;
      },
    [
      additionalProps,
      clinicalFormsWorkspaceName,
      encounterUuid,
      mutateForm,
      patient,
      patientUuid,
      props,
      visit,
      formUuid,
    ],
  );

  return (
    <div>
      {state.formUuid && patientUuid && patient && (
        <ExtensionSlot key={state.formUuid} name="form-widget-slot" state={state} />
      )}
    </div>
  );
};

export default FormEntry;
