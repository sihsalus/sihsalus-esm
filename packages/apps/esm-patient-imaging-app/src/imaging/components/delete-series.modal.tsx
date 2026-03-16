import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { deleteSeries, useStudySeries } from '../../api';

interface DeleteSeriesModalProps {
  closeDeleteModal: () => void;
  studyId: number;
  orthancSeriesUID: string;
  patientUuid: string;
}

const DeleteSeriesModal: React.FC<DeleteSeriesModalProps> = ({
  closeDeleteModal,
  studyId,
  orthancSeriesUID,
  patientUuid,
}) => {
  const { t } = useTranslation();
  const { mutate } = useStudySeries(studyId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);

    deleteSeries(orthancSeriesUID, studyId, new AbortController())
      .then((response) => {
        if (response.ok) {
          mutate();
          closeDeleteModal();
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            title: t('studySeries', 'Study Series is deleted'),
          });
        }
      })
      .catch((error) => {
        showSnackbar({
          isLowContrast: false,
          kind: 'error',
          title: t('errorDeletingSeries', 'An error occurred while deleting the study series'),
          subtitle: error?.message,
        });
      });
  }, [closeDeleteModal, studyId, orthancSeriesUID, mutate, t]);

  return (
    <div>
      <ModalHeader closeModal={closeDeleteModal} title={t('deleteStudySeries', 'Delete study series')} />
      <ModalBody>
        <p>{t('deleteModalConfirmationTextStudySeries', 'Are you sure you want to delete this study series?')}</p>
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

export default DeleteSeriesModal;
