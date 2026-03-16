import React from 'react';
import { useTranslation } from 'react-i18next';
import { Extension, ExtensionSlot } from '@openmrs/esm-framework';
import styles from './charts.scss';

export const Charts: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <ExtensionSlot name="Charts" className={styles.charts}>
        <div className={styles.chart}>
          <Extension />
        </div>
      </ExtensionSlot>
    </div>
  );
};
