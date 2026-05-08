import React, { useMemo } from 'react';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface DashboardLinkConfig {
  name: string;
  title: string;
}

const translationKeys: Record<string, string> = {
  Overview: 'overview',
  Operations: 'stockOperations',
  Items: 'stockItems',
  'User role scopes': 'userRoleScopes',
  Sources: 'sources',
  Locations: 'locations',
  Reports: 'report',
  Settings: 'adminSettings',
};

function DashboardExtension({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  const { name, title } = dashboardLinkConfig;
  const { t } = useTranslation();
  const location = useLocation();
  const spaBasePath = `${window.spaBase}/stock-management`;

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split('/');
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  const translatedTitle = translationKeys[title] ? t(translationKeys[title], title) : title;

  return (
    <ConfigurableLink
      to={`${spaBasePath}/${name}`}
      className={`cds--side-nav__link ${navLink.match(name) && 'active-left-nav-link'}`}
    >
      {translatedTitle}
    </ConfigurableLink>
  );
}

export const createDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () =>
  (
    <BrowserRouter>
      <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
    </BrowserRouter>
  );
