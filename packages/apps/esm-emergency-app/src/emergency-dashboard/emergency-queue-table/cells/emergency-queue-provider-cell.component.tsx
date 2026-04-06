import React from 'react';
import { useTranslation } from 'react-i18next';
import { type EmergencyQueueTableCellProps } from './emergency-queue-name-cell.component';

export const EmergencyQueueProviderCell: React.FC<EmergencyQueueTableCellProps> = ({ queueEntry }) => {
  const { t } = useTranslation();
  const providerName = queueEntry.providerWaitingFor?.display;

  return <span>{providerName || t('notAssigned', 'No asignado')}</span>;
};
