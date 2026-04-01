import { Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../homepage-tiles.scss';

import useTotalVisits from './total-visits.resource';

const TotalVisitsTile: React.FC = () => {
  const { data: visitsData } = useTotalVisits();

  const { t } = useTranslation();

  return (
    <Tile className={styles.tileContainer}>
      <header className={styles.tileHeader}>{t('totalVisits', 'Total Visits Today')}</header>
      <div className={styles.displayDetails}>
        <div className={styles.countLabel}>{t('patients', 'Patients')}</div>
        <div className={styles.displayData}>{visitsData?.length ?? 0}</div>
      </div>
    </Tile>
  );
};

export default TotalVisitsTile;
