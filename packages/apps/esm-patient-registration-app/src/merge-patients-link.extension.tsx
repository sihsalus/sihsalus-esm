import { HeaderGlobalAction } from '@carbon/react';
import { Merge } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './add-patient-link.scss';
import { moduleName } from './constants';

export default function MergePatientsLink() {
  const { t } = useTranslation(moduleName);
  const openMergePatients = React.useCallback(
    () => navigate({ to: `${globalThis.getOpenmrsSpaBase()}patient-merge` }),
    [],
  );

  return (
    <HeaderGlobalAction
      aria-label={t('mergeDuplicatePatients', 'Merge duplicate patient records')}
      aria-labelledby={t('mergeDuplicatePatients', 'Merge duplicate patient records')}
      onClick={openMergePatients}
      className={styles.slotStyles}
    >
      <Merge size={20} />
    </HeaderGlobalAction>
  );
}
