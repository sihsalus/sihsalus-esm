import dayjs, { type Dayjs } from 'dayjs';

import { type AppointmentCountMap, type AppointmentSummary } from '../types';

type AppointmentServiceLoadSummary = {
  serviceName: string;
  countMap: Array<AppointmentCountMap>;
};

export const getHighestAppointmentServiceLoad = (appointmentSummary: Array<AppointmentServiceLoadSummary> = []) => {
  const groupedAppointments = appointmentSummary?.map(({ countMap, serviceName }) => ({
    serviceName: serviceName,
    count: countMap.reduce((cummulator, currentValue) => cummulator + currentValue.allAppointmentsCount, 0),
  }));
  return groupedAppointments.find((summary) => summary.count === Math.max(...groupedAppointments.map((x) => x.count)));
};

export const flattenAppointmentSummary = (appointmentToTransfrom: Array<AppointmentSummary>) =>
  appointmentToTransfrom.flatMap((el) => ({
    serviceName: el.appointmentService.name ?? el.appointmentService.display,
    countMap: Object.values(el.appointmentCountMap),
  }));

export const getServiceCountByAppointmentType = (
  appointmentSummary: Array<AppointmentSummary>,
  appointmentType: keyof AppointmentCountMap,
) => {
  return appointmentSummary
    .map((el) => Object.values(el.appointmentCountMap).flatMap((entry) => entry[appointmentType] as number))
    .flat(1)
    .reduce((count, val) => count + val, 0);
};

export const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const strTime = hours + ':' + minutesText + ' ' + ampm;
  return strTime;
};

export const isSameMonth = (cellDate: Dayjs, currentDate: Dayjs) => {
  return cellDate.isSame(currentDate, 'month');
};

export const monthDays = (currentDate: Dayjs) => {
  const monthStart = dayjs(currentDate).startOf('month');
  const monthEnd = dayjs(currentDate).endOf('month');
  const monthDays = dayjs(currentDate).daysInMonth();
  const lastMonth = dayjs(currentDate).subtract(1, 'month');
  const nextMonth = dayjs(currentDate).add(1, 'month');
  const days: Dayjs[] = [];

  for (let i = lastMonth.daysInMonth() - monthStart.day() + 1; i <= lastMonth.daysInMonth(); i++) {
    days.push(dayjs().month(lastMonth.month()).date(i));
  }

  for (let i = 1; i <= monthDays; i++) {
    days.push(currentDate.date(i));
  }

  const dayLen = days.length > 30 ? 7 : 14;

  for (let i = 1; i < dayLen - monthEnd.day(); i++) {
    days.push(dayjs().month(nextMonth.month()).date(i));
  }
  return days;
};

export const getGender = (gender: string, t: (key: string, defaultValue: string) => string) => {
  switch (gender) {
    case 'M':
      return t('male', 'Male');
    case 'F':
      return t('female', 'Female');
    case 'O':
      return t('other', 'Other');
    case 'U':
      return t('unknown', 'Unknown');
    default:
      return gender;
  }
};
