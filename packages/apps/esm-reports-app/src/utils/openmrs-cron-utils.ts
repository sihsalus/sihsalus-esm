export interface OpenMRSCron {
  seconds: string;
  minutes: string;
  hours: string;
  day: string;
  month: string;
  dayOfWeek: string;
  year: string;
}

export function parseOpenMRSCron(expression: string): OpenMRSCron {
  if (!expression) {
    return null;
  }

  const tokens = expression.split(' ');
  return {
    seconds: tokens[0],
    minutes: tokens[1],
    hours: tokens[2],
    day: tokens[3],
    month: tokens[4],
    dayOfWeek: tokens[5],
    year: tokens[6],
  };
}
