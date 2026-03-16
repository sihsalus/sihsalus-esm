import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import styles from './monthly-view-workload.scss';
import type { PatientAppointment } from '../../../types';
import { isSameMonth } from '../../../utils/utils';
import SelectedDateContext from '../../../hooks/selectedDateContext';

export interface MonthlyWorkloadViewProps {
  events: Array<PatientAppointment>;
  dateTime: Dayjs;
  showAllServices?: boolean;
}

const MonthlyWorkloadView: React.FC<MonthlyWorkloadViewProps> = ({ dateTime, events }) => {
  const { selectedDate } = useContext(SelectedDateContext);

  const currentData = useMemo(
    () =>
      events?.find(
        (event) => dayjs(event.appointmentDate)?.format('YYYY-MM-DD') === dayjs(dateTime)?.format('YYYY-MM-DD'),
      ),
    [dateTime, events],
  );

  const handleAppoiment = (serviceUuid: string) => {};

  return (
    <div
      onClick={() => handleAppoiment('')}
      className={classNames(
        styles[isSameMonth(dateTime, dayjs(selectedDate)) ? 'monthly-cell' : 'monthly-cell-disabled'],
        styles.largeDesktop,
      )}>
      {isSameMonth(dateTime, dayjs(selectedDate)) && (
        <div>
          <span className={classNames(styles.totals)}>
            <b className={styles.calendarDate}>{dateTime.format('D')}</b>
          </span>
          {currentData && (
            <div className={styles.currentData}>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppoiment(currentData.appointmentId);
                }}
                className={styles.serviceArea}>
                <span>Atender Cita</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyWorkloadView;
