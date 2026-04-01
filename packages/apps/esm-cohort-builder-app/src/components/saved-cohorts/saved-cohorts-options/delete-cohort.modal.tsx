import React, { useState } from 'react';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { getCoreTranslation } from '@openmrs/esm-framework';
import styles from './delete-cohort.scss';

interface DeleteCohortModalProps {
  closeModal: () => void;
  cohortName: string;
  onDeleteCohort: () => void;
}

const DeleteCohortModal: React.FC<DeleteCohortModalProps> = ({ closeModal, cohortName, onDeleteCohort }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDeleteCohort();
    setIsDeleting(false);
    closeModal();
  };

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('deleteCohort', 'Delete cohort')} />
      <ModalBody>
        <p>
          {t('deleteCohortModalText', 'Are you sure you want to delete the cohort')} <strong>"{cohortName}"</strong>?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {getCoreTranslation('cancel')}
        </Button>
        <Button className={styles.deleteButton} kind="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <InlineLoading description={t('deleting', 'Deleting') + '...'} />
          ) : (
            <span>{getCoreTranslation('delete')}</span>
          )}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DeleteCohortModal;
