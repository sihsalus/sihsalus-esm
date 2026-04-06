import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './emergency-home.scss';

/**
 * Emergency Home Component
 *
 * Standalone home page for emergency department with complete control over layout.
 * Uses custom slots for maximum flexibility and maintainability.
 */
const EmergencyHome: React.FC = () => {
  return (
    <main className={styles.emergencyHome}>
      {/* Emergency Header */}
      <ExtensionSlot name="emergency-home-header-slot" />

      {/* Emergency Alerts */}
      <ExtensionSlot name="emergency-home-alerts-slot" />

      {/* Priority Cards - Full width row */}
      <div className={styles.priorityCardsSection}>
        <ExtensionSlot name="emergency-home-priority-cards-slot" className={styles.priorityCardsContainer} />
      </div>

      {/* Metrics Section */}
      <div className={styles.metricsSection}>
        <ExtensionSlot name="emergency-home-metrics-slot" className={styles.metricsContainer} />
      </div>

      {/* Queue Table */}
      <ExtensionSlot name="emergency-home-queue-table-slot" />
    </main>
  );
};

export default EmergencyHome;
