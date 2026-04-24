import { showSnackbar, translateFrom } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { markPatientAsDeceased } from '../api';
import { formEngineAppName } from '../globals';
import type { PatientDeathPayload, PostSubmissionAction } from '../types';
import { isOpenmrsResourceLike, isStringValue } from '../utils/common-utils';
import { extractErrorMessagesFromResponse } from '../utils/error-utils';

interface DeceasedActionConfig {
  causeOfDeathQuestionId?: string;
  dateOfDeathQuestionId?: string;
}

export const MarkPatientAsDeceasedAction: PostSubmissionAction = {
  applyAction: async function ({ patient, encounters, sessionMode }, config) {
    const t = (key: string, defaultValue: string): string => translateFrom(formEngineAppName, key, defaultValue);
    const encounter = encounters[0];
    const resolvedConfig = (config ?? {}) as DeceasedActionConfig;

    if (sessionMode === 'view' || !encounter) {
      return;
    }

    if (patient._deceasedBoolean || patient.deceasedDateTime) {
      throw new Error(t('patientIsAlreadyMarkedAsDeceased', 'Patient is already marked as deceased'));
    }

    const causeOfDeathQuestionId = resolvedConfig.causeOfDeathQuestionId;
    const dateOfDeathQuestionId = resolvedConfig.dateOfDeathQuestionId;
    if (!causeOfDeathQuestionId) {
      throw new Error(t('causeOfDeathQuestionIdIsNotConfigured', 'Cause of death question ID is not configured'));
    }
    if (!dateOfDeathQuestionId) {
      throw new Error(t('dateOfDeathQuestionIdIsNotConfigured', 'Date of death question ID is not configured'));
    }

    const causeOfDeath = encounter.obs?.find((item) => item.formFieldPath.includes(causeOfDeathQuestionId))?.value;
    const dateOfDeathValue = encounter.obs?.find((item) => item.formFieldPath.includes(dateOfDeathQuestionId))?.value;
    const dateOfDeath = isStringValue(dateOfDeathValue) ? dateOfDeathValue : undefined;

    if (!isOpenmrsResourceLike(causeOfDeath)) {
      return;
    }

    const deathPayload: PatientDeathPayload = {
      dead: true,
      causeOfDeath: causeOfDeath.uuid,
      deathDate: dateOfDeath ?? dayjs().format(),
    };
    if (!patient.id) {
      throw new Error(t('patientIdIsMissing', 'Patient ID is missing'));
    }

    const abortController = new AbortController();

    try {
      await markPatientAsDeceased(t, patient.id, deathPayload, abortController);
      showSnackbar({
        kind: 'success',
        title: t('successfullyMarkedAsDeceased', 'The patient has successfully been marked as deceased'),
        isLowContrast: true,
      });
    } catch (error) {
      showSnackbar({
        title: t('errorMarkingAsDeceased', 'Error marking patient as deceased'),
        subtitle: extractErrorMessagesFromResponse(error).join(', '),
        kind: 'error',
        isLowContrast: false,
      });
    }
  },
};

export default MarkPatientAsDeceasedAction;
