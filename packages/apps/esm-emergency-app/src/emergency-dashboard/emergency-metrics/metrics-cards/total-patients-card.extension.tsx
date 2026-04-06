import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { ErrorState } from '@openmrs/esm-framework';
import { MetricsCard, MetricsCardHeader, MetricsCardBody, MetricsCardItem } from './metrics-card.component';
import { useEmergencyMetrics } from '../../../resources/emergency.resource';
import styles from './metrics-card.scss';

const TotalPatientsCard: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isLoading, error } = useEmergencyMetrics();

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (error) {
    return <ErrorState headerTitle={t('errorLoadingMetrics', 'Error loading metrics')} error={error} />;
  }

  return (
    <MetricsCard>
      <MetricsCardHeader title={t('emergencyPatients', 'Emergency Patients')} />
      <MetricsCardBody>
        <MetricsCardItem label={t('totalPatients', 'Total patients')} value={metrics.totalPatients} />
        <MetricsCardItem
          label={t('patientsWithoutTriage', 'Patients without triage')}
          value={metrics.patientsWithoutTriage}
          small
          color={metrics.patientsWithoutTriage > 0 ? 'red' : 'default'}
        />
      </MetricsCardBody>
    </MetricsCard>
  );
};

export default TotalPatientsCard;
