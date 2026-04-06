import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './emergency-metrics-container.scss';

/**
 * Emergency Metrics Container
 * 
 * Uses ExtensionSlot to allow metrics cards to be registered as extensions.
 * This follows the OpenMRS Extension System pattern for extensibility.
 */
const EmergencyMetricsContainer: React.FC = () => {
  return (
    <ExtensionSlot
      name="emergency-metrics-slot"
      className={styles.metricsContainer}
      data-testid="emergency-metrics"
    />
  );
};

export default EmergencyMetricsContainer;






