import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { endEmergencyQueueEntry, type EmergencyQueueEntry } from '../resources/emergency.resource';
import EmergencyQueueConfirmActionModal from './emergency-queue-confirm-action.modal';

interface RemoveQueueEntryModalProps {
  queueEntry: EmergencyQueueEntry;
  closeModal: () => void;
}

const RemoveQueueEntryModal: React.FC<RemoveQueueEntryModalProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();
  const patient = queueEntry.patient.display;
  const queue = queueEntry.queue.display;

  const modalInstruction = (
    <Trans i18nKey="confirmRemovePatientFromQueue" values={{ patient, queue }}>
      ¿Está seguro de que desea eliminar a <strong>{'{{patient}}'}</strong> de {'{{queue}}'}?
    </Trans>
  );

  return (
    <EmergencyQueueConfirmActionModal
      queueEntry={queueEntry}
      closeModal={closeModal}
      modalParams={{
        modalTitle: t('removePatientFromQueue', 'Eliminar a {{patient}} de la cola', { patient }),
        modalInstruction,
        submitButtonText: t('remove', 'Eliminar'),
        submitSuccessTitle: t('patientRemoved', 'Paciente eliminado'),
        submitSuccessText: t('patientRemovedSuccessfully', 'Paciente eliminado de la cola exitosamente'),
        submitFailureTitle: t('errorRemovingPatient', 'Error al eliminar paciente de la cola'),
        submitAction: (queueEntry) => endEmergencyQueueEntry(queueEntry.uuid),
        isDanger: true,
      }}
    />
  );
};

export default RemoveQueueEntryModal;
