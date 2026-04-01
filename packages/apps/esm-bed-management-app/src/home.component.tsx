import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from './header/header.component';
import styles from './home.scss';
import BedManagementSummary from './summary/summary.component';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <Header title={t('bedManagement', 'Bed management')} />
      <BedManagementSummary />
    </section>
  );
};

export default Home;
