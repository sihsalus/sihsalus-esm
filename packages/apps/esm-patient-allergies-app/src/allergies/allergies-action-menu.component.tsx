import { Layer, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { showModal, useLayoutType } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { patientAllergiesFormWorkspace } from '../constants';
import { type Allergy } from '../types';
import styles from './allergies-action-menu.scss';

interface allergiesActionMenuProps {
  allergy: Allergy;
  patientUuid?: string;
}

export const AllergiesActionMenu = ({ allergy, patientUuid }: allergiesActionMenuProps) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  void React;

  const launchEditAllergiesForm = useCallback(() => {
    launchPatientWorkspace(patientAllergiesFormWorkspace, {
      allergy,
      formContext: 'editing',
    });
  }, [allergy]);

  const launchDeleteAllergyDialog = (allergyId: string) => {
    const dispose = showModal('delete-allergy-modal', {
      closeDeleteModal: () => dispose(),
      allergyId,
      patientUuid,
    });
  };

  return (
    <Layer className={styles.layer}>
      <OverflowMenu
        aria-label={t('editOrDeleteAllergy', 'Edit or delete allergy')}
        align="left"
        size={isTablet ? 'lg' : 'sm'}
        flipped
      >
        <OverflowMenuItem
          className={styles.menuItem}
          id="editAllergy"
          onClick={launchEditAllergiesForm}
          itemText={t('edit', 'Edit')}
        />
        <OverflowMenuItem
          className={styles.menuItem}
          id="deleteAllergy"
          itemText={t('delete', 'Delete')}
          onClick={() => launchDeleteAllergyDialog(allergy.id)}
          isDelete
          hasDivider
        />
      </OverflowMenu>
    </Layer>
  );
};
