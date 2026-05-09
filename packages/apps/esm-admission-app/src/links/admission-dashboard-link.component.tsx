import { ClickableTile, Layer } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';

import { basePath, moduleName } from '../constants';
import styles from './links.scss';

export default function AdmissionDashboardLink() {
  const { t } = useTranslation(moduleName);

  return (
    <Layer>
      <ClickableTile href={`${globalThis.getOpenmrsSpaBase().slice(0, -1)}${basePath}`} className={styles.tile}>
        <div>
          <div className={styles.heading}>{t('admission', 'Admisión')}</div>
          <div className={styles.content}>{t('admissionReportByUps', 'Reporte de admisiones por UPS')}</div>
        </div>
        <ArrowRight size={16} />
      </ClickableTile>
    </Layer>
  );
}
