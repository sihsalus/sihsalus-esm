import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import React from 'react';

import FuaDashboard from './fua-dashboard.component';

const Root: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-fua-app">
      <FuaDashboard />
    </AppErrorBoundary>
  );
};

export default Root;
