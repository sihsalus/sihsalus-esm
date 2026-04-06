import { OverflowMenuItem } from '@carbon/react';
import { useVisit, showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './action-button.scss';

interface CancelVisitOverflowMenuItemProps {
  patientUuid: string;
}

const CancelVisitOverflowMenuItem: React.FC<CancelVisitOverflowMenuItemProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { activeVisit, currentVisit } = useVisit(patientUuid);
  const effectiveVisit = currentVisit ?? activeVisit;

  const handleLaunchModal = useCallback(() => {
    const dispose = showModal('cancel-visit-dialog', {
      closeModal: () => dispose(),
      patientUuid,
    });
  }, [patientUuid]);

  return (
    effectiveVisit && (
      <OverflowMenuItem
        className={styles.menuitem}
        itemText={t('cancelVisit', 'Cancel visit')}
        onClick={handleLaunchModal}
      />
    )
  );
};

export default CancelVisitOverflowMenuItem;
