import { DataTableSkeleton } from '@carbon/react';
import { Group } from '@carbon/react/icons';
import { ErrorState } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEmergencyMetrics } from '../../../resources/emergency.resource';
import {
  MetricsCard,
  MetricsCardBody,
  MetricsCardHeader,
  MetricsCardItem,
} from '../../emergency-metrics/metrics-cards/metrics-card.component';

const TotalActiveCard: React.FC<{ queueUuid?: string }> = ({ queueUuid }) => {
  const { t } = useTranslation();
  const { metrics, isLoading, error } = useEmergencyMetrics(undefined, undefined, queueUuid);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (error) {
    return <ErrorState headerTitle={t('errorLoadingMetrics', 'Error loading metrics')} error={error} />;
  }

  return (
    <MetricsCard>
      <MetricsCardHeader title={t('totalActive', 'Total activos')} icon={<Group size={24} />} />
      <MetricsCardBody>
        <MetricsCardItem label={t('patients', 'pacientes')} value={metrics.totalPatients} />
      </MetricsCardBody>
    </MetricsCard>
  );
};

export default TotalActiveCard;
