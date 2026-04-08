import React from 'react';
import { AppErrorBoundary } from '@sihsalus/rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PatientSearchPageComponent from './patient-search-page/patient-search-page.component';

const PatientSearchRootComponent: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-patient-search-app">
        <BrowserRouter basename={globalThis.getOpenmrsSpaBase()}>
        <Routes>
          <Route path="search" element={<PatientSearchPageComponent />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default PatientSearchRootComponent;
