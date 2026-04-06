/**
 * Initial Priority Selector Component
 *
 * Quick 2-option selector for emergency registration:
 * - Emergencia (Emergency) → Separate pre-triage concept
 * - Urgencia (Urgency) → Separate pre-triage concept
 *
 * These are NOT mapped to Priority I-IV. The detailed 4-level priority
 * is assigned during formal triage by the nurse.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButtonGroup, RadioButton, Tag } from '@carbon/react';
import styles from './initial-priority-selector.component.scss';

export type InitialPriority = 'emergency' | 'urgency';

interface InitialPrioritySelectorProps {
  value?: InitialPriority;
  onChange: (value: InitialPriority) => void;
  disabled?: boolean;
}

const InitialPrioritySelector: React.FC<InitialPrioritySelectorProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h6 className={styles.title}>{t('initialPriority', 'Prioridad inicial')}</h6>
      <p className={styles.subtitle}>
        {t('initialPriorityDescription', 'La prioridad detallada se asigna durante el triaje.')}
      </p>

      <RadioButtonGroup
        name="initial-priority"
        valueSelected={value || ''}
        onChange={(val: string) => onChange(val as InitialPriority)}
        orientation="vertical"
        className={styles.radioGroup}
      >
        <RadioButton
          value="emergency"
          disabled={disabled}
          className={styles.emergencyOption}
          labelText={
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{t('emergency', 'Emergencia')}</span>
                <Tag type="red" size="sm">
                  {t('immediateAttention', 'Atención inmediata')}
                </Tag>
              </div>
              <p className={styles.optionDescription}>
                {t(
                  'emergencyDescription',
                  'Paciente con riesgo vital o descompensación. Requiere evaluación prioritaria.',
                )}
              </p>
            </div>
          }
        />
        <RadioButton
          value="urgency"
          disabled={disabled}
          className={styles.urgencyOption}
          labelText={
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{t('urgency', 'Urgencia')}</span>
                <Tag type="green" size="sm">
                  {t('canWaitTriage', 'Puede esperar triaje')}
                </Tag>
              </div>
              <p className={styles.optionDescription}>
                {t('urgencyDescription', 'Paciente estable, sin riesgo vital inmediato. Será evaluado en triaje.')}
              </p>
            </div>
          }
        />
      </RadioButtonGroup>
    </div>
  );
};

export default InitialPrioritySelector;

/**
 * Maps initial priority selection to the corresponding pre-triage concept UUID and sortWeight.
 * Uses separate concepts (Emergencia/Urgencia) that are NOT Priority I-IV.
 */
export function mapInitialPriorityToConfig(
  priority: InitialPriority,
  emergencyConceptUuid: string,
  urgencyConceptUuid: string,
): { conceptUuid: string; sortWeight: number } {
  if (priority === 'emergency') {
    return { conceptUuid: emergencyConceptUuid, sortWeight: 1 };
  }
  return { conceptUuid: urgencyConceptUuid, sortWeight: 2 };
}
