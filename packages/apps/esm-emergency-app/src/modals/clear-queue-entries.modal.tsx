import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSkeleton, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { useSWRConfig } from 'swr';
import { endEmergencyQueueEntry, type EmergencyQueueEntry } from '../resources/emergency.resource';

interface ClearQueueEntriesModalProps {
  queueEntries: Array<EmergencyQueueEntry>;
  closeModal: () => void;
}

const ClearQueueEntriesModal: React.FC<ClearQueueEntriesModalProps> = ({ queueEntries, closeModal }) => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClearAll = useCallback(() => {
    setIsSubmitting(true);
    Promise.all(queueEntries.map((entry) => endEmergencyQueueEntry(entry.uuid)))
      .then(() => {
        showSnackbar({
          isLowContrast: true,
          title: t('clearQueue', 'Limpiar cola'),
          kind: 'success',
          subtitle: t('queuesClearedSuccessfully', 'Cola limpiada exitosamente'),
        });
        mutate((key) => typeof key === 'string' && key.includes('/queue-entry'));
        closeModal();
      })
      .catch((error) => {
        showSnackbar({
          title: t('errorClearingQueues', 'Error al limpiar cola'),
          kind: 'error',
          subtitle: error?.message,
        });
        closeModal();
      });
  }, [queueEntries, closeModal, mutate, t]);

  return (
    <>
      <ModalHeader
        closeModal={closeModal}
        label={t('emergencyQueue', 'Cola de emergencias')}
        title={t('clearAllQueueEntries', 'Limpiar todos los registros de la cola?')}
      />
      <ModalBody>
        <p>
          {t(
            'clearAllQueueEntriesWarningMessage',
            'Esto eliminará a todos los pacientes ({{count}}) de la cola. Esta acción no se puede deshacer.',
            { count: queueEntries.length },
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancelar')}
        </Button>
        {isSubmitting ? (
          <ButtonSkeleton />
        ) : (
          <Button kind="danger" onClick={handleClearAll}>
            {t('clearQueueEntries', 'Limpiar cola')}
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default ClearQueueEntriesModal;
