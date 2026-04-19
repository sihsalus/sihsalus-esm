import React from 'react';
import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLeftNav } from '@openmrs/esm-framework';
import Dashboard from './dashboard/home-dashboard.component';

const Root: React.FC = () => {
  const spaBasePath = `${globalThis.spaBase}/stock-management`;

  useLeftNav({
    name: 'stock-page-dashboard-slot',
    basePath: spaBasePath,
  });

  return (
    <AppErrorBoundary appName="esm-stock-management-app">
      <main className="omrs-main-content">
        <BrowserRouter basename={globalThis.spaBase}>
          <Routes>
            <Route path="/stock-management" element={<Dashboard />} />
            <Route path="/stock-management/:dashboard/*" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </main>
    </AppErrorBoundary>
  );
};

export default Root;
