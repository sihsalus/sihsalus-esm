import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ModalHeader
        closeModal={onCancel}
        title={t('deleteQuestionConfirmation', 'Are you sure you want to delete this question?')}
      />
      <ModalBody>
        <p>{t('deleteQuestionExplainerText', 'This action cannot be undone.')}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onCancel}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={onConfirm}>
          {t('deleteQuestion', 'Delete question')}
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};

export default DeleteModal;
