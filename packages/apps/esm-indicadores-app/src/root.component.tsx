import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import React from 'react';

import IndicatorsDashboard from './indicators-dashboard.component';

const RootComponent: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-indicadores-app">
      <IndicatorsDashboard />
    </AppErrorBoundary>
  );
};

export default RootComponent;
