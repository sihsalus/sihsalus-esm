import { DataTableSkeleton, Layer, Tile } from '@carbon/react';
import { Checkmark, WarningFilled } from '@carbon/react/icons';
import { ErrorState, useConfig } from '@openmrs/esm-framework';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Config } from '../../config-schema';
import { useEmergencyQueueEntries } from '../../resources/emergency.resource';
import styles from './priority-level-cards-container.scss';
import cardStyles from './triage-classification-cards.scss';

interface TriageClassificationCardsProps {
  queueUuid?: string;
}

/**
 * Triage Classification Cards
 *
 * Shows Emergencia/Urgencia counts for the triage queue.
 * Uses sortWeight to distinguish: 1 = Emergencia, 2 = Urgencia.
 */
const TriageClassificationCards: React.FC<TriageClassificationCardsProps> = ({ queueUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<Config>();
  const { queueEntries, isLoading, error } = useEmergencyQueueEntries(undefined, undefined, undefined, queueUuid);

  const counts = useMemo(() => {
    let emergency = 0;
    let urgency = 0;
    queueEntries.forEach((entry) => {
      const priorityUuid = entry.priority?.uuid;
      if (priorityUuid === config.concepts.emergencyConceptUuid) {
        emergency++;
      } else if (priorityUuid === config.concepts.urgencyConceptUuid) {
        urgency++;
      }
    });
    return { emergency, urgency, total: queueEntries.length };
  }, [queueEntries, config.concepts.emergencyConceptUuid, config.concepts.urgencyConceptUuid]);

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
        <ErrorState headerTitle={t('errorLoadingTriageData', 'Error loading triage data')} error={error} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Layer>
          <Tile className={cardStyles.card}>
            <div className={cardStyles.cardHeader}>
              <WarningFilled size={24} className={cardStyles.emergencyIcon} />
            </div>
            <div className={cardStyles.cardContent}>
              <h4 className={cardStyles.cardLabel}>{t('emergency', 'Emergencia')}</h4>
              <p className={cardStyles.cardDescription}>{t('immediateAttention', 'Atención inmediata')}</p>
              <p className={cardStyles.cardCount}>{counts.emergency}</p>
              <p className={cardStyles.cardCountLabel}>
                {counts.emergency === 1 ? t('patient', 'patient') : t('patients', 'patients')}
              </p>
            </div>
          </Tile>
        </Layer>
        <Layer>
          <Tile className={cardStyles.card}>
            <div className={cardStyles.cardHeader}>
              <Checkmark size={24} className={cardStyles.urgencyIcon} />
            </div>
            <div className={cardStyles.cardContent}>
              <h4 className={cardStyles.cardLabel}>{t('urgency', 'Urgencia')}</h4>
              <p className={cardStyles.cardDescription}>{t('canWaitTriage', 'Puede esperar triaje')}</p>
              <p className={cardStyles.cardCount}>{counts.urgency}</p>
              <p className={cardStyles.cardCountLabel}>
                {counts.urgency === 1 ? t('patient', 'patient') : t('patients', 'patients')}
              </p>
            </div>
          </Tile>
        </Layer>
      </div>
    </div>
  );
};

export default TriageClassificationCards;
