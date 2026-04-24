import { TagSkeleton } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './allergies-tile.scss';
import { useAllergies } from './allergy-intolerance.resource';

interface AllergyTileProps {
  patientUuid: string;
}

const AllergyTile: React.FC<AllergyTileProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { allergies, isLoading } = useAllergies(patientUuid);

  if (isLoading) {
    return <TagSkeleton />;
  }

  if (allergies?.length) {
    return (
      <div>
        <p className={styles.label}>{t('allergies', 'Allergies')}</p>
        <p className={styles.content}>
          <span className={styles.value}>{allergies?.map((allergy) => allergy?.display).join(', ')}</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.label}>{t('allergies', 'Allergies')}</p>
      <p className={styles.content}>{t('unknown', 'Unknown')}</p>
    </div>
  );
};

export default AllergyTile;
