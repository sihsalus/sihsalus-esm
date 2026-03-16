import React from 'react';
import { DatePickerInput, DatePicker } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Location, UserFollow } from '@carbon/react/icons';
import { useSession } from '@openmrs/esm-framework';
import ImmunizationIllustration from './immunization-plan-illustration.component';
import styles from './immunization-plan-header.scss';

interface ImmunizationPlanHeaderProps {
  title: string;
}

const ImmunizationPlanHeader: React.FC<ImmunizationPlanHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const session = useSession();
  const location = session?.sessionLocation?.display;

  return (
    <div className={styles.header} data-testid="immunization-plan-header">
      <div className={styles['left-justified-items']}>
        <ImmunizationIllustration />
        <div className={styles['page-labels']}>
          <p>{t('immunization', 'Immunization')}</p>
          <p className={styles['page-name']}>{title}</p>
        </div>
      </div>
      <div className={styles['right-justified-items']}>
        <div className={styles.userContainer}>
          <p>{session?.user?.person?.display}</p>
          <UserFollow size={16} className={styles.userIcon} />
        </div>
        <div className={styles['date-and-location']}>
          <Location size={16} />
          <span className={styles.value}>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationPlanHeader;
