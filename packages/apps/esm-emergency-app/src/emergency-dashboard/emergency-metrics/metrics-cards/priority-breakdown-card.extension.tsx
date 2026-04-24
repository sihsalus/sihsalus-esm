import { DataTableSkeleton } from '@carbon/react';
import { ErrorState } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePriorityConfig } from '../../../hooks/usePriorityConfig';
import { usePatientsByPriority } from '../../../resources/emergency.resource';
import { MetricsCard, MetricsCardBody, MetricsCardHeader, MetricsCardItem } from './metrics-card.component';

const PriorityBreakdownCard: React.FC = () => {
  const { t } = useTranslation();
  const { counts, isLoading, error } = usePatientsByPriority();
  const { getPriorityByCode } = usePriorityConfig();

  const priorityI = getPriorityByCode('PRIORITY_I');
  const priorityII = getPriorityByCode('PRIORITY_II');
  const priorityIII = getPriorityByCode('PRIORITY_III');
  const priorityIV = getPriorityByCode('PRIORITY_IV');

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (error) {
    return <ErrorState headerTitle={t('errorLoadingPriorityData', 'Error loading priority data')} error={error} />;
  }

  const mapColor = (color: string): 'red' | 'green' | 'default' | 'orange' => {
    if (color === 'red' || color === 'green' || color === 'orange') {
      return color;
    }
    return 'default';
  };

  return (
    <MetricsCard>
      <MetricsCardHeader title={t('patientsByPriority', 'Patients by Priority')} />
      <MetricsCardBody>
        {priorityI && (
          <MetricsCardItem label={priorityI.label} value={counts.priorityI} color={mapColor(priorityI.color)} />
        )}
        {priorityII && (
          <MetricsCardItem label={priorityII.label} value={counts.priorityII} color={mapColor(priorityII.color)} />
        )}
        {priorityIII && (
          <MetricsCardItem label={priorityIII.label} value={counts.priorityIII} color={mapColor(priorityIII.color)} />
        )}
        {priorityIV && (
          <MetricsCardItem label={priorityIV.label} value={counts.priorityIV} color={mapColor(priorityIV.color)} />
        )}
      </MetricsCardBody>
    </MetricsCard>
  );
};

export default PriorityBreakdownCard;
