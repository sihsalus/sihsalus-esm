import * as cronjsMatcher from '@datasert/cronjs-matcher';
import * as cronjsParser from '@datasert/cronjs-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';

dayjs.extend(utc);

interface NextReportExecutionProps {
  schedule: string;
  currentDate: Date;
}

const NextReportExecution: React.FC<NextReportExecutionProps> = ({ schedule, currentDate }) => {
  const nextReportExecutionDate = (() => {
    if (!schedule) {
      return '';
    }

    const expression = cronjsParser.parse(schedule, { hasSeconds: true });
    const nextExecutions = cronjsMatcher.getFutureMatches(expression, {
      startAt: currentDate.toISOString(),
      matchCount: 1,
    });
    return nextExecutions.length === 1 ? dayjs.utc(nextExecutions[0].toString()).format('YYYY-MM-DD HH:mm') : '';
  })();

  return <span>{nextReportExecutionDate}</span>;
};

export default NextReportExecution;
