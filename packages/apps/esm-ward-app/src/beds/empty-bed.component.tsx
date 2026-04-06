import React from 'react';
import { useTranslation } from 'react-i18next';

import { type Bed } from '../types';
import wardPatientCardStyles from '../ward-patient-card/ward-patient-card.scss';

import styles from './ward-bed.scss';

interface EmptyBedProps {
  bed: Bed;
}

const EmptyBed: React.FC<EmptyBedProps> = ({ bed }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.emptyBed}>
      <span className={`${wardPatientCardStyles.wardPatientBedNumber} ${wardPatientCardStyles.empty}`}>
        {bed.bedNumber}
      </span>
      <p className={styles.emptyBedText}>{t('emptyBed', 'Empty bed')}</p>
    </div>
  );
};

export default EmptyBed;
