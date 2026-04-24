import { ExtensionSlot } from '@openmrs/esm-framework';
import React from 'react';
import styles from './compact-metrics-container.scss';

/**
 * Compact Metrics Container
 *
 * Container for compact metric cards (Total, Waiting, Avg Wait).
 * Uses ExtensionSlot following OpenMRS Extension System pattern.
 */
interface CompactMetricsContainerProps {
  queueUuid?: string;
}

const CompactMetricsContainer: React.FC<CompactMetricsContainerProps> = ({ queueUuid }) => {
  return (
    <ExtensionSlot
      name="emergency-compact-metrics-slot"
      className={styles.container}
      data-testid="compact-metrics"
      state={{ queueUuid }}
    />
  );
};

export default CompactMetricsContainer;
