import { DataTableSkeleton } from '@carbon/react';
import { ErrorState } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePriorityConfig } from '../../../hooks/usePriorityConfig';
import { useAverageWaitTimeByPriority } from '../../../resources/emergency.resource';
import { MetricsCard, MetricsCardBody, MetricsCardHeader, MetricsCardItem } from './metrics-card.component';

const AverageWaitTimeCard: React.FC = () => {
  const { t } = useTranslation();
  const { averages, isLoading, error } = useAverageWaitTimeByPriority();
  const { getPriorityByCode } = usePriorityConfig();

  const priorityI = getPriorityByCode('PRIORITY_I');
  const priorityII = getPriorityByCode('PRIORITY_II');
  const priorityIII = getPriorityByCode('PRIORITY_III');
  const priorityIV = getPriorityByCode('PRIORITY_IV');

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (error) {
    return <ErrorState headerTitle={t('errorLoadingWaitTime', 'Error loading wait time')} error={error} />;
  }

  const formatWaitTime = (minutes: number | null) => {
    if (minutes === null) return '--';
    if (minutes < 60) return `${minutes} ${t('minutes', 'min')}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}${t('minutes', 'min')}`;
  };

  return (
    <MetricsCard>
      <MetricsCardHeader title={t('averageWaitTime', 'Average Wait Time')} />
      <MetricsCardBody>
        {priorityI && (
          <MetricsCardItem
            label={priorityI.label}
            value={formatWaitTime(averages.priorityI)}
            color={averages.priorityI && averages.priorityI > priorityI.maxWaitTimeMinutes ? 'red' : 'default'}
          />
        )}
        {priorityII && (
          <MetricsCardItem
            label={priorityII.label}
            value={formatWaitTime(averages.priorityII)}
            color={averages.priorityII && averages.priorityII > priorityII.maxWaitTimeMinutes ? 'red' : 'default'}
          />
        )}
        {priorityIII && (
          <MetricsCardItem
            label={priorityIII.label}
            value={formatWaitTime(averages.priorityIII)}
            color={averages.priorityIII && averages.priorityIII > priorityIII.maxWaitTimeMinutes ? 'orange' : 'default'}
          />
        )}
        {priorityIV && (
          <MetricsCardItem label={priorityIV.label} value={formatWaitTime(averages.priorityIV)} color="default" />
        )}
      </MetricsCardBody>
    </MetricsCard>
  );
};

export default AverageWaitTimeCard;
