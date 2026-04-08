import { ConfigurableLink, MaybeIcon } from '@openmrs/esm-framework';
import classNames from 'classnames';
import { last } from 'lodash-es';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import styles from './dashboard-extension.scss';

export interface DashboardExtensionProps {
  readonly path: string;
  readonly title: string;
  readonly basePath: string;
  readonly icon: string;
  readonly moduleName?: string;
}

export const DashboardExtension = ({
  path,
  title,
  basePath,
  icon,
  moduleName = '@sihsalus/esm-patient-chart-app',
}: DashboardExtensionProps) => {
  const { t } = useTranslation(moduleName);
  const location = useLocation();

  const navLink = useMemo(() => decodeURIComponent(last(location.pathname.split('/'))), [location.pathname]);

  return (
    <div key={path}>
      <ConfigurableLink
        className={classNames('cds--side-nav__link', { 'active-left-nav-link': path === navLink })}
        to={`${basePath}/${encodeURIComponent(path)}`}
      >
        <span className={styles.menu}>
          <MaybeIcon icon={icon} className={styles.icon} size={16} />
          <span>{t(title)}</span>
        </span>
      </ConfigurableLink>
    </div>
  );
};
