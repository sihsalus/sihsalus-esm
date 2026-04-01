import { Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../homepage-tiles.scss';

import useActiveVisits from './active-visits.resource';

const ActiveVisitsTile: React.FC = () => {
  const { count } = useActiveVisits();

  const { t } = useTranslation();

  return (
    <Tile className={styles.tileContainer}>
      <header className={styles.tileHeader}>{t('activeVisits', 'Active Visits')}</header>
      <div className={styles.displayDetails}>
        <div className={styles.countLabel}>{t('patients', 'Patients')}</div>
        <div className={styles.displayData}>{count ?? 0}</div>
      </div>
    </Tile>
  );
};

export default ActiveVisitsTile;
