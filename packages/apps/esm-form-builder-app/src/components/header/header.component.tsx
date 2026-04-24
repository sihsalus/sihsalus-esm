import { Calendar, Location, UserFollow } from '@carbon/react/icons';
import { formatDate, PageHeader, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './header.scss';
import Illustration from './illustration.component';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const session = useSession();
  const location = session?.sessionLocation?.display;

  return (
    <PageHeader className={styles.header}>
      <div className={styles.leftJustifiedItems}>
        <Illustration />
        <div className={styles.pageLabels}>
          <p>{t('formBuilder', 'Form builder')}</p>
          <p className={styles.pageName}>{title}</p>
        </div>
      </div>
      <div className={styles.rightJustifiedItems}>
        <div className={styles.userContainer}>
          <p>{session?.user?.person?.display}</p>
          <UserFollow size={16} className={styles.userIcon} />
        </div>
        <div className={styles.dateAndLocation}>
          <Location size={16} />
          <span className={styles.value}>{location}</span>
          <span className={styles.middot}>&middot;</span>
          <Calendar size={16} />
          <span className={styles.value}>{formatDate(new Date(), { mode: 'standard' })}</span>
        </div>
      </div>
    </PageHeader>
  );
};

export default Header;
