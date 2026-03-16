import React, { useContext } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import MonthlyViewWorkload from './monthly-workload-view.component';
import MonthlyHeader from './monthly-header.component';
import styles from '../appointments-calendar-view-view.scss';
import { monthDays } from '../../../utils/utils';
import SelectedDateContext from '../../../hooks/selectedDateContext';
import type { PatientAppointment } from '../../../types';

dayjs.extend(isBetween);

interface MonthlyCalendarViewProps {
  events: Array<PatientAppointment>;
}

const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({ events }) => {
  const { selectedDate } = useContext(SelectedDateContext);

  return (
    <div className={styles.calendarViewContainer}>
      <MonthlyHeader />
      <div className={styles.wrapper}>
        <div className={styles.monthlyCalendar}>
          {monthDays(dayjs(selectedDate)).map((dateTime, i) => (
            <MonthlyViewWorkload key={i} dateTime={dateTime} events={events} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
