export interface CronField {
  name: string;
  value: number | string;
}

export const ST_ONCE = 'once';
export const ST_EVERY_DAY = 'everyDay';
export const ST_EVERY_WEEK = 'everyWeek';
export const ST_EVERY_MONTH = 'everyMonth';
export const ST_ADVANCED = 'advanced';
export const SCHEDULE_TYPES = [ST_ONCE, ST_EVERY_DAY, ST_EVERY_WEEK, ST_EVERY_MONTH, ST_ADVANCED];
export const SCHEDULE_TYPE_DEFAULT_LABELS: Record<string, string> = {
  once: 'Once',
  everyDay: 'Every day',
  everyWeek: 'Every week',
  everyMonth: 'Every month',
};
export const DAYS_OF_WEEK: CronField[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
].map((name, idx) => ({
  name,
  value: idx,
}));
export const DAYS_OF_WEEK_DEFAULT_LABELS: Record<string, string> = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};
export const DAYS_OF_MONTH: CronField[] = [
  { name: '', value: '' },
  { name: 'firstDay', value: '1' },
  { name: 'lastDay', value: 'L' },
];
export const DAYS_OF_MONTH_DEFAULT_LABELS: Record<string, string> = {
  firstDay: 'First day',
  lastDay: 'Last day',
};
