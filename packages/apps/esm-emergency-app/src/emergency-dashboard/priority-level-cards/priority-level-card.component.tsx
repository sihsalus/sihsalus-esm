import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Layer, Tile, DefinitionTooltip } from '@carbon/react';
import { Warning, Time, Activity, WarningFilled, Information } from '@carbon/react/icons';
import styles from './priority-level-card.scss';

export interface PriorityLevelCardProps {
  level: 'I' | 'II' | 'III' | 'IV';
  label: string;
  description: string;
  count: number;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
  tooltipText?: string;
}

export const PriorityLevelCard: React.FC<PriorityLevelCardProps> = ({
  level,
  label,
  description,
  count,
  color,
  tooltipText,
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (level) {
      case 'I':
        return <WarningFilled size={24} className={styles.icon} />;
      case 'II':
        return <Warning size={24} className={styles.icon} />;
      case 'III':
        return <Time size={24} className={styles.icon} />;
      case 'IV':
        return <Activity size={24} className={styles.icon} />;
      default:
        return <Activity size={24} className={styles.icon} />;
    }
  };

  return (
    <Layer>
      <Tile className={classNames(styles.card, styles[color])}>
        <div className={styles.header}>
          {getIcon()}
          {tooltipText && (
            <DefinitionTooltip align="bottom-right" openOnHover definition={tooltipText} className={styles.infoTooltip}>
              <Information size={16} className={styles.infoIcon} />
            </DefinitionTooltip>
          )}
        </div>
        <div className={styles.content}>
          <h4 className={styles.label}>{label}</h4>
          <p className={styles.description}>{description}</p>
          <p className={styles.count}>{count}</p>
          <p className={styles.countLabel}>{count === 1 ? t('patient', 'patient') : t('patients', 'patients')}</p>
        </div>
      </Tile>
    </Layer>
  );
};
