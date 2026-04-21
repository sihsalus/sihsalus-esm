export type amPm = 'AM' | 'PM';

export const convertTime12to24 = (time12h, timeFormat: amPm) => {
  const parts = time12h.split(':');
  let hours = parts[0];
  const minutes = parts[1];

  if (hours === '12' && timeFormat === 'AM') {
    hours = '00';
  }

  if (timeFormat === 'PM') {
    hours = hours === '12' ? hours : parseInt(hours, 10) + 12;
  }

  return [hours, minutes];
};
