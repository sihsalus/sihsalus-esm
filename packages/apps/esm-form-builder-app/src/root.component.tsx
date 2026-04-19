import React from 'react';
import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from './components/dashboard/dashboard.component';
import FormEditor from './components/form-editor/form-editor.component';

const RootComponent: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-form-builder-app">
      <BrowserRouter basename={`${globalThis.spaBase}/form-builder`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<FormEditor />} />
          <Route path="/edit/:formUuid" element={<FormEditor />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default RootComponent;
