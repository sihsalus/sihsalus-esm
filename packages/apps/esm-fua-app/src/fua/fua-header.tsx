import { Calendar, Location } from '@carbon/react/icons';
import { Assessment2Pictogram, formatDate, PageHeader, PageHeaderContent, useSession } from '@openmrs/esm-framework';
import React from 'react';

import styles from './fua-header.scss';

interface FuaHeaderProps {
  title: string;
}

export const FuaHeader: React.FC<FuaHeaderProps> = ({ title }) => {
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  return (
    <PageHeader className={styles.header}>
      <PageHeaderContent title={title} illustration={<Assessment2Pictogram />} />
      <div className={styles.rightJustifiedItems}>
        <div className={styles.dateAndLocation}>
          <Location size={16} />
          <span className={styles.value}>{userLocation}</span>
          <span className={styles.middot}>&middot;</span>
          <Calendar size={16} />
          <span className={styles.value}>{formatDate(new Date(), { mode: 'standard' })}</span>
        </div>
      </div>
    </PageHeader>
  );
};
