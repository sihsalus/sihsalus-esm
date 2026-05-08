import { ConfigurableLink } from '@openmrs/esm-framework';
import last from 'lodash-es/last';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, useLocation } from 'react-router-dom';

export interface LinkConfig {
  name: string;
  title: string;
}

function getOpenmrsSpaBase(): string {
  const value = (globalThis as { getOpenmrsSpaBase?: () => unknown }).getOpenmrsSpaBase?.();
  return typeof value === 'string' ? value : '';
}

function LinkExtension({ config }: { config: LinkConfig }) {
  const { t } = useTranslation();
  const { name, title } = config;
  const location = useLocation();

  let urlSegment = useMemo(() => {
    const segment = last(location.pathname.split('/'));
    return decodeURIComponent(segment ?? '');
  }, [location.pathname]);

  const isUUID = (value: string) => {
    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    return regex.test(value);
  };

  if (isUUID(urlSegment)) {
    urlSegment = 'summary';
  }

  return (
    <ConfigurableLink
      to={`${getOpenmrsSpaBase()}bed-management${name && name !== 'bed-management' ? `/${name}` : ''}`}
      className={`cds--side-nav__link ${name === urlSegment && 'active-left-nav-link'}`}
    >
      {t(title, title)}
    </ConfigurableLink>
  );
}

export const createLeftPanelLink = (config: LinkConfig) => () => (
  <BrowserRouter>
    <LinkExtension config={config} />
  </BrowserRouter>
);
