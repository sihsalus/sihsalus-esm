import { HomePictogram, PageHeader } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './page-header.scss';

interface PageHeaderProps {
  dashboardTitle: string;
}

const HomePageHeader: React.FC<PageHeaderProps> = ({ dashboardTitle }) => {
  const { t } = useTranslation();
  const title = dashboardTitle === 'home' ? t('homeDashboardTitle', 'Admisión y atención') : t(dashboardTitle);

  /**
   * Translation for the home page header
   * // t('home', 'Home')
   * // t('homeDashboardTitle', 'Admisión y atención')
   */
  return <PageHeader className={styles.pageHeader} illustration={<HomePictogram />} title={title} />;
};

export default HomePageHeader;
