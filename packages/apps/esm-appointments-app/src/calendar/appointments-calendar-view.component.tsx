import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { omrsDateFormat } from '../constants';
import AppointmentsHeader from '../header/appointments-header.component';
import SelectedDateContext from '../hooks/selectedDateContext';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';

import CalendarHeader from './header/calendar-header.component';
import MonthlyCalendarView from './monthly/monthly-calendar-view.component';

const AppointmentsCalendarView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('day').format(omrsDateFormat));
  const { calendarEvents } = useAppointmentsCalendar(dayjs(selectedDate).toISOString(), 'monthly');

  const params = useParams();

  useEffect(() => {
    if (params.date) {
      setSelectedDate(dayjs(params.date).startOf('day').format(omrsDateFormat));
    }
  }, [params.date]);

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      <div data-testid="appointments-calendar">
        <AppointmentsHeader title={t('calendar', 'Calendar')} />
        <CalendarHeader />
        <MonthlyCalendarView events={calendarEvents} />
      </div>
    </SelectedDateContext.Provider>
  );
};

export default AppointmentsCalendarView;
