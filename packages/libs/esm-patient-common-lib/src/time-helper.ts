export type amPm = 'AM' | 'PM';

export const time12HourFormatRegex = new RegExp(/^(1[0-2]|0?[1-9]):[0-5][0-9]$/);

export const convertTime12to24 = (time12h: string, timeFormat: amPm) => {
  if (!time12h.match(time12HourFormatRegex)) {
    return [0, 0];
  }

  const [rawHours, minutes] = time12h.split(':').map((item) => Number.parseInt(item, 10));
  let hours = rawHours % 12;

  if (timeFormat === 'PM') {
    hours += 12;
  }

  return [hours, minutes];
};
