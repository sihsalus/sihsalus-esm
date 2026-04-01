import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './reports.scss';

interface ReportStatusProps {
  hasSchedule: string;
}

const ScheduledReportStatus: React.FC<ReportStatusProps> = ({ hasSchedule }) => {
  const { t } = useTranslation();

  return (
    <span
      className={classNames({
        [styles.scheduledStatusText]: hasSchedule,
        [styles.notScheduledStatusText]: !hasSchedule,
      })}
    >
      {hasSchedule ? t('scheduled', 'Scheduled') : t('notScheduled', 'Not scheduled')}
    </span>
  );
};

export default ScheduledReportStatus;
