import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import React from 'react';

import { Router } from './routes/router';

const RootComponent: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-coststructure-app">
      <Router />
    </AppErrorBoundary>
  );
};

export default RootComponent;
