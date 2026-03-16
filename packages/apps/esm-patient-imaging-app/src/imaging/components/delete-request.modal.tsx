import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { deleteRequest, useRequestsByPatient } from '../../api';

interface DeleteRequestModalProps {
  closeDeleteModal: () => void;
  requestId: number;
  patientUuid: string;
}

const DeleteRequestModal: React.FC<DeleteRequestModalProps> = ({ closeDeleteModal, requestId, patientUuid }) => {
  const { t } = useTranslation();
  const { mutate } = useRequestsByPatient(patientUuid);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);

    deleteRequest(requestId, new AbortController())
      .then((response) => {
        if (response.ok) {
          mutate();
          closeDeleteModal();
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('requestDeleted', 'Request deleted'),
          });
        }
      })
      .catch((error) => {
        showSnackbar({
          isLowContrast: false,
          kind: 'error',
          title: t('errorDeletingRequest', 'An error occurred while deleting the requested procedure'),
          subtitle: error?.message,
        });
      });
  }, [closeDeleteModal, requestId, mutate, t]);

  return (
    <div>
      <ModalHeader closeModal={closeDeleteModal} title={t('deletePatientRequest', 'Delete requested procedure')} />
      <ModalBody>
        <p>{t('deleteModalConfirmationTextRequest', 'Are you sure you want to delete this requested procdure?')}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeDeleteModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <InlineLoading description={t('deleting', 'Deleting') + '...'} />
          ) : (
            <span>{t('delete', 'Delete')}</span>
          )}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DeleteRequestModal;
