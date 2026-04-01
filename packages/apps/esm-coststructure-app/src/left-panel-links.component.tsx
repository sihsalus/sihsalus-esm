import { ConfigurableLink } from '@openmrs/esm-framework';
import last from 'lodash-es/last';
import React, { useMemo } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { baseName } from './constants';

export interface LinkConfig {
  name: string;
  title: string;
}

function LinkExtension({ config }: { config: LinkConfig }) {
  const { name, title } = config;
  const location = useLocation();

  const urlSegment = useMemo(() => decodeURIComponent(last(location.pathname.split('/')) ?? ''), [location.pathname]);

  return (
    <ConfigurableLink
      to={`${baseName}${name ? `/${name}` : ''}`}
      className={`cds--side-nav__link ${name === urlSegment ? 'active-left-nav-link' : ''}`}
    >
      {title}
    </ConfigurableLink>
  );
}

export const createLeftPanelLink = (config: LinkConfig) => () => (
  <BrowserRouter>
    <LinkExtension config={config} />
  </BrowserRouter>
);
