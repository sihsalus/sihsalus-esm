import { WorkspaceContainer } from '@openmrs/esm-framework';
import { AppErrorBoundary } from '@sihsalus/rbac';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import WardView from './ward-view/ward-view.component';

const Root: React.FC = () => {
  // t('wards', 'Wards')
  const wardViewBasename = globalThis.getOpenmrsSpaBase() + 'home/ward';

  return (
    <AppErrorBoundary appName="esm-ward-app">
        <main>
        <BrowserRouter basename={wardViewBasename}>
          <Routes>
            <Route path="/" element={<WardView />} />
            <Route path="/:locationUuid" element={<WardView />} />
          </Routes>
        </BrowserRouter>
      </main>
    </AppErrorBoundary>
  );
};

export default Root;
