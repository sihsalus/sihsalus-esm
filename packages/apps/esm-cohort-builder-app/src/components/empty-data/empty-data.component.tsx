import { Layer, Tile } from '@carbon/react';
import { EmptyCardIllustration } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './empty-data.style.scss';

export interface EmptyDataProps {
  displayText: string;
}

const EmptyData: React.FC<EmptyDataProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Layer>
      <Tile className={styles.tile}>
        <EmptyCardIllustration />
        <p className={styles.content}>
          {t('noDataToDisplay', 'There are no {{displayText}} to display', {
            displayText: props.displayText.toLowerCase(),
          })}
        </p>
      </Tile>
    </Layer>
  );
};

export default EmptyData;
