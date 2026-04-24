import { InlineNotification } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEmergencyMetrics } from '../../resources/emergency.resource';
import styles from './emergency-alerts.scss';

/**
 * Emergency Alerts Component
 *
 * Displays critical alerts for:
 * - Critical patients requiring immediate attention (Priority I)
 * - Patients waiting for triage
 *
 * Uses Carbon's InlineNotification component following OpenMRS patterns
 */
const EmergencyAlerts: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isLoading } = useEmergencyMetrics();

  if (isLoading) {
    return null;
  }

  const criticalPatients = metrics.patientsByPriority.priorityI;
  const patientsWaitingTriage = metrics.patientsWithoutTriage;

  return (
    <div className={styles.alertsContainer}>
      {criticalPatients > 0 && (
        <InlineNotification
          kind="error"
          lowContrast={false}
          hideCloseButton={true}
          title={t('criticalPatientsAlert', '{{count}} critical patient(s) requiring immediate attention', {
            count: criticalPatients,
          })}
          subtitle={t('criticalPatientsSubtitle', 'Level I - Resuscitation patients in queue')}
          className={styles.criticalAlert}
        />
      )}
      {patientsWaitingTriage > 0 && (
        <InlineNotification
          kind="warning"
          lowContrast={false}
          hideCloseButton={true}
          title={t('patientsWaitingTriageAlert', '{{count}} patient(s) waiting for triage', {
            count: patientsWaitingTriage,
          })}
          subtitle={t('patientsWaitingTriageSubtitle', 'Assign triage level to proceed with treatment')}
          className={styles.triageAlert}
        />
      )}
    </div>
  );
};

export default EmergencyAlerts;
