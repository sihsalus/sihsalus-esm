import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showSnackbar, updateVisit, useVisit, useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { useInfiniteVisits2 } from '../visits-widget/visit.resource';
import styles from './end-visit-dialog.scss';
import { type ChartConfig } from '../../config-schema';

// Placeholder for useFUATemplate hook
const useFUATemplate = (templateUuid: string) => {
  // Simulated template data (replace with actual API call)
  const FUATemplate = {
    uuid: templateUuid,
    name: 'FUA Template',
    content: '<!-- Placeholder FUA template content -->',
  };

  // Placeholder for fetching logic
  // Example: const response = await fetch(`baseUrl/o3/forms/${templateUuid}`);
  // const FUATemplate = await response.json();

  return { data: FUATemplate, isLoading: false, error: null };
};

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
  const { FUATemplateUuid } = useConfig<ChartConfig>();
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
    if (activeVisit && FUATemplate && !isLoading && !templateError) {
      const endVisitPayload = {
        stopDatetime: new Date(),
        // fuaGenerated: true, // Uncomment if needed in payload
      };

      const abortController = new AbortController();

      try {
        // Placeholder: Fetch FUA PDF template
        // In reality, this might involve fetching a Jasper template or similar
        // Example: const templateResponse = await fetch(`baseUrl/o3/forms/${FUATemplateUuid}`);

        // Placeholder: Fill template with data (Jasper-like processing)
        const visitData = {
          patientUuid,
          visitUuid: activeVisit.uuid,
          visitType: activeVisit.visitType?.display,
          // Add more data as needed
        };
        // Example: const filledTemplate = processJasperTemplate(FUATemplate, visitData);

        // Placeholder: Download the filled template as PDF
        // This could use a library like jsPDF or a backend service
        const blob = new Blob(['Placeholder FUA PDF content'], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FUA_${activeVisit.uuid}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        // Update visit
        await updateVisit(activeVisit.uuid, endVisitPayload, abortController);

        mutate();
        mutateInfiniteVisits();
        closeModal();

        showSnackbar({
          isLowContrast: true,
          kind: 'success',
          subtitle: t('visitEndSuccessfully', `${activeVisit.visitType?.display} ended successfully`),
          title: t('visitEndedAndFUAGenerated', 'Visit ended and FUA Generated'),
        });
      } catch (error) {
        showSnackbar({
          title: t('errorEndingVisitOrGeneratingFUA', 'Error ending visit or generating FUA'),
          kind: 'error',
          isLowContrast: false,
          subtitle: error?.message || 'Unknown error',
        });
      }
    } else {
      showSnackbar({
        title: t('errorGeneratingFUA', 'Error generating FUA'),
        kind: 'error',
        isLowContrast: false,
        subtitle: t('templateNotAvailable', 'FUA template is not available'),
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
