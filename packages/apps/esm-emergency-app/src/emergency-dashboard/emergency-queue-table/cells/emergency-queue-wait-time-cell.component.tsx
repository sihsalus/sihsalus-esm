import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type EmergencyQueueTableCellProps } from './emergency-queue-name-cell.component';

export const EmergencyQueueWaitTimeCell: React.FC<EmergencyQueueTableCellProps> = ({ queueEntry }) => {
  const { t } = useTranslation();
  const startedAt = dayjs(queueEntry.startedAt);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrentTime(dayjs()), 60_000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const totalMinutes = currentTime.diff(startedAt, 'minutes');
  const hours = Math.trunc(totalMinutes / 60);
  const minutes = Math.trunc(totalMinutes % 60);

  if (hours > 0) {
    return (
      <span>
        {t('hourAndMinuteFormatted', '{{hours}} hour(s) and {{minutes}} minute(s)', {
          hours,
          minutes: Math.abs(minutes),
        })}
      </span>
    );
  }

  return <span>{t('minuteFormatted', '{{minutes}} minute(s)', { minutes })}</span>;
};
