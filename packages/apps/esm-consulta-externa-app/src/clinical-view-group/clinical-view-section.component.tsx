import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './clinical-view-section.scss';
import { Information as InformationIcon } from '@carbon/react/icons';
import { Tooltip } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { registerNavGroup } from './nav-group';

interface ClinicalViewSectionProps {
  basePath: string;
}

export const ClinicalViewSection: React.FC<ClinicalViewSectionProps> = ({ basePath }) => {
  const slotName = 'clinical-view-section';
  const { t } = useTranslation();

  useEffect(() => {
    if (slotName) {
      registerNavGroup(slotName);
    }
  }, [slotName]);

  return (
    <>
      <div className={styles.container}>
        <span className={styles.span}>{t('clinicalViews', 'Clinical views')}</span>
        <Tooltip
          align="top"
          label={t(
            'customViews',
            "In this section, you'll find custom clinical views tailored to patients' conditions and enrolled care programs.",
          )}>
          <button className={styles.tooltipButton} type="button">
            <InformationIcon className={styles.icon} size={20} />
          </button>
        </Tooltip>
      </div>
      <ExtensionSlot style={{ width: '100%', minWidth: '15rem' }} name={slotName} state={{ basePath }} />
    </>
  );
};

export default ClinicalViewSection;
