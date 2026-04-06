import { InlineLoading } from '@carbon/react';
import { FormEngine } from '@openmrs/esm-form-engine-lib';
import { showModal, useConfig } from '@openmrs/esm-framework';
import { clinicalFormsWorkspace, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomDataSources } from '../hooks/useCustomDataSources';
import { useCustomEncounterDatetime } from '../hooks/useCustomEncounterDatetime';
import useFormSchema from '../hooks/useFormSchema';
import { useLabOrderNotification } from '../hooks/useLabOrderNotification';
import { useVisitDateValidation } from '../hooks/useVisitDateValidation';
import { setFormState } from '../store/form-state.store';
import type { FormEntryReactConfig, FormWidgetProps } from '../types';

import FormError from './form-error.component';
import styles from './form-renderer.scss';

const FormRenderer: React.FC<FormWidgetProps> = ({
  formUuid,
  patientUuid,
  encounterUuid,
  visitUuid,
  visitTypeUuid,
  visitStartDatetime,
  visitStopDatetime,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
  promptBeforeClosing,
  isOffline,
  additionalProps,
  clinicalFormsWorkspaceName = clinicalFormsWorkspace,
}) => {
  const { t } = useTranslation();
  const config = useConfig<FormEntryReactConfig>();
  const { schema, error, isLoading } = useFormSchema(formUuid);

  // Gap feature hooks
  useCustomDataSources(config);
  const { adjustVisitDatesIfNeeded } = useVisitDateValidation(visitUuid, visitStartDatetime, visitStopDatetime);
  const { showLabOrdersNotification } = useLabOrderNotification();
  const preFilledQuestions = useCustomEncounterDatetime(
    config,
    visitStartDatetime,
    additionalProps?.preFilledQuestions,
  );

  const openClinicalFormsWorkspaceOnFormClose = additionalProps?.openClinicalFormsWorkspaceOnFormClose ?? true;
  const formSessionIntent = additionalProps?.formSessionIntent ?? '*';
  const mode = additionalProps?.mode ?? (encounterUuid ? 'edit' : 'enter');

  const visit = useMemo(() => {
    if (!visitUuid) return undefined;
    return {
      uuid: visitUuid,
      startDatetime: visitStartDatetime,
      stopDatetime: visitStopDatetime ?? null,
      visitType: visitTypeUuid ? { uuid: visitTypeUuid, display: '' } : undefined,
      encounters: [],
    } as any;
  }, [visitUuid, visitStartDatetime, visitStopDatetime, visitTypeUuid]);

  const handleCloseForm = useCallback(() => {
    closeWorkspace();
    if (!encounterUuid && openClinicalFormsWorkspaceOnFormClose) {
      launchPatientWorkspace(clinicalFormsWorkspaceName);
    }
  }, [closeWorkspace, encounterUuid, openClinicalFormsWorkspaceOnFormClose, clinicalFormsWorkspaceName]);

  const handleConfirmQuestionDeletion = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const dispose = showModal('form-engine-delete-question-confirm-modal', {
        onCancel() {
          dispose();
          reject();
        },
        onConfirm() {
          dispose();
          resolve();
        },
      });
    });
  }, []);

  const handleMarkFormAsDirty = useCallback(
    (isDirty: boolean) => promptBeforeClosing?.(() => isDirty),
    [promptBeforeClosing],
  );

  const handleOnSubmit = useCallback(
    async (data: any) => {
      setFormState(formUuid, 'submitted');

      // Extract encounter UUID from submission data
      const submittedEncounterUuid = data?.encounters?.[0]?.uuid ?? data?.uuid;

      if (submittedEncounterUuid) {
        // Post-submission: adjust visit dates if encounter datetime is out of bounds
        await adjustVisitDatesIfNeeded(submittedEncounterUuid);
        // Post-submission: show lab orders notification
        await showLabOrdersNotification(submittedEncounterUuid);
      }

      closeWorkspaceWithSavedChanges?.();
    },
    [formUuid, adjustVisitDatesIfNeeded, showLabOrdersNotification, closeWorkspaceWithSavedChanges],
  );

  // Track form state
  if (isLoading && formUuid) {
    setFormState(formUuid, 'loading');
  } else if (error && formUuid) {
    setFormState(formUuid, 'loadingError');
  } else if (schema && formUuid) {
    setFormState(formUuid, 'ready');
  }

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <InlineLoading className={styles.loading} description={`${t('loading', 'Loading')} ...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FormError closeWorkspace={handleCloseForm} clinicalFormsWorkspaceName={clinicalFormsWorkspaceName} />
      </div>
    );
  }

  return (
    <>
      {schema && (
        <FormEngine
          encounterUUID={encounterUuid}
          formJson={schema}
          handleClose={handleCloseForm}
          handleConfirmQuestionDeletion={handleConfirmQuestionDeletion}
          markFormAsDirty={handleMarkFormAsDirty}
          mode={mode}
          formSessionIntent={formSessionIntent}
          onSubmit={handleOnSubmit}
          patientUUID={patientUuid}
          visit={visit}
          preFilledQuestions={preFilledQuestions}
        />
      )}
    </>
  );
};

export default FormRenderer;
