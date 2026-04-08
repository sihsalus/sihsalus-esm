import React from 'react';
import { AppErrorBoundary } from '@sihsalus/rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ListDetails from './list-details/list-details.component';
import ListsDashboard from './lists-dashboard/lists-dashboard.component';

const RootComponent: React.FC = () => {
  const patientListsBasename = globalThis.getOpenmrsSpaBase() + 'home/patient-lists';

  return (
    <AppErrorBoundary appName="esm-patient-list-management-app">
        <BrowserRouter basename={patientListsBasename}>
        <Routes>
          <Route path="/" element={<ListsDashboard />} />
          <Route path="/:patientListUuid" element={<ListDetails />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default RootComponent;
