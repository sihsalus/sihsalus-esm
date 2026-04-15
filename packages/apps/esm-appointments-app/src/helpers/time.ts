export type amPm = 'AM' | 'PM';

export const convertTime12to24 = (time12h: string, timeFormat: amPm): [string, string] => {
  const [hourPart, minutes] = time12h.split(':');
  let hours = hourPart;

  if (hours === '12' && timeFormat === 'AM') {
    hours = '00';
  }

  if (timeFormat === 'PM') {
    hours = hours === '12' ? hours : String(parseInt(hours, 10) + 12);
  }

  return [hours, minutes];
};
