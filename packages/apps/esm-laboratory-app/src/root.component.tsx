import React from 'react';
import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LaboratoryDashboard from './laboratory-dashboard.component';

const Root: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-laboratory-app">
      <BrowserRouter basename={`${globalThis.spaBase}/home/laboratory`}>
        <Routes>
          <Route path="/" element={<LaboratoryDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default Root;
