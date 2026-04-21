/**
 * Emergency Module - Main component
 *
 * This is the root component for the Emergency module.
 * It renders the emergency dashboard which displays metrics, patient queues,
 * and provides access to the emergency workflow.
 */

import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmergencyDashboard from './emergency-dashboard/emergency-dashboard.component';

const Root: React.FC = () => {
  const basename = globalThis.getOpenmrsSpaBase() + 'emergency';

  return (
    <AppErrorBoundary appName="esm-emergency-app">
      <BrowserRouter basename={basename}>
        <main>
          <Routes>
            <Route path="/" element={<EmergencyDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default Root;
