import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { openmrsFetch, restBaseUrl, showSnackbar, updateVisit, useConfig, useVisit } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { type ChartConfig } from '../../config-schema';
import { useInfiniteVisits2 } from '../visits-widget/visit.resource';

import styles from './end-visit-dialog.scss';

interface FUAFormTemplate {
  uuid: string;
  name: string;
  description?: string;
  encounterType?: { uuid: string; display: string };
}

function useFUATemplate(templateUuid: string) {
  const url = templateUuid ? `${restBaseUrl}/form/${templateUuid}?v=custom:(uuid,name,description,encounterType)` : null;
  const { data, error, isLoading } = useSWR<{ data: FUAFormTemplate }, Error>(url, openmrsFetch);
  return {
    data: data?.data ?? null,
    isLoading,
    error,
  };
}

async function downloadFuaDocument(
  generatorEndpoint: string,
  visitUuid: string,
  t: (key: string, defaultValue: string) => string,
) {
  const url = `${generatorEndpoint}?visitUuid=${visitUuid}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t('errorFetchingFuaDocument', 'Could not fetch FUA document from generator'));
  }
  const html = await response.text();
  const blob = new Blob([html], { type: 'text/html' });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `FUA_${visitUuid}.html`;
  link.click();
  window.URL.revokeObjectURL(objectUrl);
}

interface EndVisitDialogProps {
  patientUuid: string;
  closeModal: () => void;
}

/**
 * This modal shows up when user clicks on the "End visit" button in the action menu within the
 * patient banner. It should only show when the patient has an active visit. See stop-visit.component.tsx
 * for the button.
 */

/**
 * Se esta modificando esta funcion para darle soporte a la funcionalidad de generar FUA (formato unico de atención).
 */
const EndVisitDialog: React.FC<EndVisitDialogProps> = ({ patientUuid, closeModal }) => {
  const { t } = useTranslation();
  const { activeVisit, mutate } = useVisit(patientUuid);
  const { mutate: mutateInfiniteVisits } = useInfiniteVisits2(patientUuid);
  const { FUATemplateUuid, fuaGeneratorEndpoint } = useConfig<ChartConfig>();
  const { data: FUATemplate, isLoading, error: templateError } = useFUATemplate(FUATemplateUuid);

  const handleEndVisit = () => {
    if (activeVisit) {
      const endVisitPayload = {
        stopDatetime: new Date(),
      };

      const abortController = new AbortController();

      updateVisit(activeVisit.uuid, endVisitPayload, abortController)
        .then((response) => {
          mutate();
          mutateInfiniteVisits();
          closeModal();

          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            subtitle: t('visitEndSuccessfully', `${response?.data?.visitType?.display} ended successfully`),
            title: t('visitEnded', 'Visit ended'),
          });
        })
        .catch((error) => {
          showSnackbar({
            title: t('errorEndingVisit', 'Error ending visit'),
            kind: 'error',
            isLowContrast: false,
            subtitle: error?.message,
          });
        });
    }
  };

  const handleEndVisitAndGenerateFUA = async () => {
    if (!activeVisit || !FUATemplate || isLoading || templateError) {
      showSnackbar({
        title: t('errorGeneratingFUA', 'Error generating FUA'),
        kind: 'error',
        isLowContrast: false,
        subtitle: t('templateNotAvailable', 'FUA template is not available'),
      });
      return;
    }

    const abortController = new AbortController();
    try {
      await updateVisit(activeVisit.uuid, { stopDatetime: new Date() }, abortController);
      mutate();
      mutateInfiniteVisits();
      closeModal();

      showSnackbar({
        isLowContrast: true,
        kind: 'success',
        subtitle: t('visitEndSuccessfully', `${activeVisit.visitType?.display} ended successfully`),
        title: t('visitEndedAndFUAGenerated', 'Visit ended and FUA Generated'),
      });

      if (fuaGeneratorEndpoint) {
        await downloadFuaDocument(fuaGeneratorEndpoint, activeVisit.uuid, t);
      }
    } catch (error) {
      showSnackbar({
        title: t('errorEndingVisitOrGeneratingFUA', 'Error ending visit or generating FUA'),
        kind: 'error',
        isLowContrast: false,
        subtitle: error?.message ?? t('unknownError', 'Unknown error'),
      });
    }
  };

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        title={t('endActiveVisitConfirmation', 'Are you sure you want to end this active visit?')}
      />
      <ModalBody>
        <p className={styles.bodyShort02}>
          {t('youCanAddAdditionalEncounters', 'You can add additional encounters to this visit in the visit summary.')}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleEndVisitAndGenerateFUA} disabled={isLoading || !!templateError}>
          {t('endVisitAndGenerateFua_title', 'End Visit and Generate FUA')}
        </Button>
        <Button kind="danger--tertiary" onClick={handleEndVisit}>
          {t('closeVisit_title', 'Close Visit')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default EndVisitDialog;
