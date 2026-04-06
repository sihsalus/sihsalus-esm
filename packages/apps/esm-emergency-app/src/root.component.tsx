/**
 * Emergency Module - Main component
 * 
 * This is the root component for the Emergency module.
 * It renders the emergency dashboard which displays metrics, patient queues,
 * and provides access to the emergency workflow.
 */

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmergencyDashboard from './emergency-dashboard/emergency-dashboard.component';

const Root: React.FC = () => {
  const basename = window.getOpenmrsSpaBase() + 'emergency';

  return (
    <BrowserRouter basename={basename}>
      <main>
        <Routes>
          <Route path="/" element={<EmergencyDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default Root;
