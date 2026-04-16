import { InlineLoading } from '@carbon/react';
import { FormEngine, type PreFilledQuestions, type SessionMode } from '@sihsalus/esm-form-engine-lib';
import { showModal, useConfig, type Encounter, type OpenmrsResource, type Visit } from '@openmrs/esm-framework';
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

interface FormRendererAdditionalProps {
  formSessionIntent?: string;
  mode?: SessionMode;
  openClinicalFormsWorkspaceOnFormClose?: boolean;
  preFilledQuestions?: PreFilledQuestions;
}

const FormRenderer: React.FC<FormWidgetProps> = (props) => {
  const {
    formUuid,
    patientUuid,
    encounterUuid,
    visitUuid,
    visitTypeUuid,
    visitStartDatetime,
    visitStopDatetime,
    additionalProps,
    preFilledQuestions: directPreFilledQuestions,
    hideControls,
    hidePatientBanner,
    showDiscardSubmitButtons,
    handlePostResponse,
    handleEncounterCreate,
    handleOnValidate,
    clinicalFormsWorkspaceName = clinicalFormsWorkspace,
  } = props;
  const { t } = useTranslation();
  const config = useConfig<FormEntryReactConfig>();
  const { schema, error, isLoading } = useFormSchema(formUuid);
  const typedAdditionalProps = additionalProps as FormRendererAdditionalProps | undefined;

  // Gap feature hooks
  useCustomDataSources(config);
  const { adjustVisitDatesIfNeeded } = useVisitDateValidation(visitUuid, visitStartDatetime, visitStopDatetime);
  const { showLabOrdersNotification } = useLabOrderNotification();
  const basePreFilledQuestions = directPreFilledQuestions ?? typedAdditionalProps?.preFilledQuestions;
  const preFilledQuestions = useCustomEncounterDatetime(config, visitStartDatetime, basePreFilledQuestions);

  const openClinicalFormsWorkspaceOnFormClose = typedAdditionalProps?.openClinicalFormsWorkspaceOnFormClose ?? true;
  const formSessionIntent = typedAdditionalProps?.formSessionIntent ?? '*';
  const mode = typedAdditionalProps?.mode ?? (encounterUuid ? 'edit' : 'enter');
  const effectiveHideControls = hideControls ?? showDiscardSubmitButtons === false;

  const visit = useMemo<Visit | undefined>(() => {
    if (!visitUuid) {
      return undefined;
    }

    return {
      uuid: visitUuid,
      startDatetime: visitStartDatetime,
      stopDatetime: visitStopDatetime ?? null,
      visitType: visitTypeUuid ? { uuid: visitTypeUuid, display: '' } : undefined,
      encounters: [],
    } as Visit;
  }, [visitUuid, visitStartDatetime, visitStopDatetime, visitTypeUuid]);

  const handleCloseForm = useCallback(() => {
    props.closeWorkspace();
    if (!encounterUuid && openClinicalFormsWorkspaceOnFormClose) {
      void launchPatientWorkspace(clinicalFormsWorkspaceName);
    }
  }, [props, encounterUuid, openClinicalFormsWorkspaceOnFormClose, clinicalFormsWorkspaceName]);

  const handleConfirmQuestionDeletion = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const dispose = showModal('form-engine-delete-question-confirm-modal', {
        onCancel() {
          dispose();
          reject(new Error('Question deletion cancelled'));
        },
        onConfirm() {
          dispose();
          resolve();
        },
      });
    });
  }, []);

  const handleMarkFormAsDirty = useCallback((isDirty: boolean) => props.promptBeforeClosing?.(() => isDirty), [props]);

  const handleOnSubmit = useCallback(
    async (data: Array<OpenmrsResource>) => {
      setFormState(formUuid, 'submitted');

      const submittedEncounter = data.find(
        (result): result is OpenmrsResource & Encounter => typeof result?.uuid === 'string',
      );
      const submittedEncounterUuid = submittedEncounter?.uuid;

      if (submittedEncounterUuid) {
        await adjustVisitDatesIfNeeded(submittedEncounterUuid);
        await showLabOrdersNotification(submittedEncounterUuid);
      }

      handlePostResponse?.(submittedEncounter);
      props.closeWorkspaceWithSavedChanges?.();
    },
    [formUuid, adjustVisitDatesIfNeeded, showLabOrdersNotification, handlePostResponse, props],
  );

  const handleValidate = useCallback(
    (valid: boolean) => {
      setFormState(formUuid, valid ? 'ready' : 'readyWithValidationErrors');
      handleOnValidate?.(valid);
    },
    [formUuid, handleOnValidate],
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
          handleEncounterCreate={handleEncounterCreate}
          handleOnValidate={handleValidate}
          hideControls={effectiveHideControls}
          hidePatientBanner={hidePatientBanner}
          markFormAsDirty={handleMarkFormAsDirty}
          mode={mode}
          formSessionIntent={formSessionIntent}
          onSubmit={(data) => {
            void handleOnSubmit(data);
          }}
          patientUUID={patientUuid}
          visit={visit}
          preFilledQuestions={preFilledQuestions}
        />
      )}
    </>
  );
};

export default FormRenderer;
