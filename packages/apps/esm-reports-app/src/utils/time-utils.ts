export const TIME_PATTERN = '^(2[0-3]|[0-1]?[0-9]):([0-5][0-9])$';
export const TIME_PATTERN_REG_EXP = new RegExp(TIME_PATTERN);

export interface Time {
  hours: number;
  minutes: number;
}

export function parseTime(text: string): Time | null {
  if (!text || !TIME_PATTERN_REG_EXP.test(text)) {
    return null;
  }

  const parts = text.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}

export function to24HTime(date: Date | Time): string {
  if (!date) {
    return '';
  }

  let hours: number, minutes: number;
  if ('getHours' in date) {
    hours = date.getHours();
    minutes = date.getMinutes();
  } else {
    ({ hours, minutes } = date);
  }

  if (hours > 23 || minutes > 59) {
    return '';
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
