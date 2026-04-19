import React from 'react';
import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { SystemAdministrationDashboard } from './dashboard/index.component';

const RootComponent: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-system-admin-app">
      <BrowserRouter basename={`${globalThis.spaBase}/system-administration`}>
        <Routes>
          <Route path="/" element={<SystemAdministrationDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default RootComponent;
