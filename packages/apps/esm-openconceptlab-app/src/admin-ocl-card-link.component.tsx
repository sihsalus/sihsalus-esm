import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, ClickableTile } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import styles from './admin-ocl-card-link.scss';

const OpenConceptLabCardLink: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Layer>
      <a className={styles.cardLink} href={`${window.spaBase}/ocl`} target="_blank" rel="norefferer">
        <ClickableTile>
          <div>
            <div className="heading">{t('manageConcepts', 'Manage Concepts')}</div>
            <div className="content">{t('openConceptLab', 'Open Concept Lab')}</div>
          </div>
          <div className="iconWrapper">
            <ArrowRightIcon size={16} />
          </div>
        </ClickableTile>
      </a>
    </Layer>
  );
};

export default OpenConceptLabCardLink;
