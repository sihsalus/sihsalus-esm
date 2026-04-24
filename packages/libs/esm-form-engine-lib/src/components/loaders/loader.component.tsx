import { InlineLoading } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './loader.scss';

const Loader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.loaderContainer}>
      <InlineLoading className={styles.loader} description={`${t('loading', 'Loading')} ...`} />
    </div>
  );
};

export default Loader;
