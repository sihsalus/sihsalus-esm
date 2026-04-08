import { AppErrorBoundary } from '@sihsalus/rbac';
import { useConfig, useLeftNav } from '@openmrs/esm-framework';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { type HomeConfig } from './config-schema';
import DashboardContainer from './dashboard-container/dashboard-container.component';
import { DefaultDashboardRedirect } from './default-dashboard-redirect.component';

const Root: React.FC = () => {
  const spaBasePath = globalThis.spaBase;
  const { leftNavMode } = useConfig<HomeConfig>();
  useLeftNav({
    name: 'homepage-dashboard-slot',
    basePath: spaBasePath,
    mode: leftNavMode,
  });

  return (
    <AppErrorBoundary appName="esm-home-app">
      <main className="omrs-main-content">
        <BrowserRouter basename={globalThis.spaBase}>
          <Routes>
            <Route path="/home" element={<DefaultDashboardRedirect />} />
            <Route path="/home/:dashboard/*" element={<DashboardContainer />} />
          </Routes>
        </BrowserRouter>
      </main>
    </AppErrorBoundary>
  );
};

export default Root;
