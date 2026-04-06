import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { ExtensionSlot, ErrorState } from '@openmrs/esm-framework';
import { usePatientsByPriority } from '../../resources/emergency.resource';
import styles from './priority-level-cards-container.scss';

/**
 * Priority Level Cards Container
 *
 * Displays 4 horizontal cards, one for each priority level using OpenMRS Extension System.
 * Uses Flexbox for responsive layout (same pattern as service-queues-app metrics).
 *
 * Extension Slot: emergency-priority-card-slot
 * Extensions: priority-i-card, priority-ii-card, priority-iii-card, priority-iv-card
 *
 * Pattern: Follows esm-service-queues-app/metrics-container.component.tsx
 * - ExtensionSlot receives className directly
 * - CSS flexbox with .container > * selector controls all extension children
 */
interface PriorityLevelCardsContainerProps {
  queueUuid?: string;
}

const PriorityLevelCardsContainer: React.FC<PriorityLevelCardsContainerProps> = ({ queueUuid }) => {
  const { t } = useTranslation();
  const { isLoading, error } = usePatientsByPriority(undefined, undefined, queueUuid);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <DataTableSkeleton role="progressbar" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <ErrorState headerTitle={t('errorLoadingPriorityData', 'Error loading priority data')} error={error} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ExtensionSlot name="emergency-priority-card-slot" className={styles.container} state={{ queueUuid }} />
    </div>
  );
};

export default PriorityLevelCardsContainer;
