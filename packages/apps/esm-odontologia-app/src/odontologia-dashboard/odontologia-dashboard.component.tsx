import React from 'react';
import { useTranslation } from 'react-i18next';

import OdontologiaAttentionDashboard from '../dental-attention/odontologia-attention-dashboard.component';
import OdontogramDashboard from '../odontogram-dashboard/odontogram-dashboard.component';
import styles from './odontologia-dashboard.scss';

type OdontologiaDashboardProps = {
  patientUuid: string;
};

const OdontologiaDashboard: React.FC<OdontologiaDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <section className={styles.section} aria-labelledby="odontologia-attention-section-title">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} id="odontologia-attention-section-title">
            {t('dentalAttention', 'Atención odontológica')}
          </h2>
          <p className={styles.sectionDescription}>
            {t(
              'dentalAttentionSectionDescription',
              'Registra y consulta las atenciones odontológicas del paciente en esta misma vista.',
            )}
          </p>
        </div>
        <div className={styles.sectionBody}>
          <OdontologiaAttentionDashboard patientUuid={patientUuid} embedded />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="odontologia-odontogram-section-title">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} id="odontologia-odontogram-section-title">
            {t('odontogram', 'Odontograma')}
          </h2>
          <p className={styles.sectionDescription}>
            {t(
              'odontogramSectionDescription',
              'Visualiza el odontograma base y registra las intervenciones odontológicas asociadas al paciente.',
            )}
          </p>
        </div>
        <div className={styles.sectionBody}>
          <OdontogramDashboard patientUuid={patientUuid} embedded />
        </div>
      </section>
    </div>
  );
};

export default OdontologiaDashboard;
