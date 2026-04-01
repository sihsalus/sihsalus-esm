import React from 'react';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';

const Tutorial = () => {
  const { t } = useTranslation();

  const handleOpenModal = () => {
    const dispose = showModal('tutorial-modal', {
      onClose: () => dispose(),
      size: 'sm',
    });
  };

  return (
    <button type="button" onClick={handleOpenModal} style={{ all: 'unset', cursor: 'pointer' }}>
      {t('tutorial', 'Tutorials')}
    </button>
  );
};

export default Tutorial;
