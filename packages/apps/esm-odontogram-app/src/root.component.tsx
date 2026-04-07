import '@carbon/styles/css/styles.css';
import { AppErrorBoundary } from '@sihsalus/rbac';
import React from 'react';

import OdontogramNuevoBridge from './components/OdontogramNuevoBridge';

export default function OdontogramRoot() {
  return (
    <AppErrorBoundary appName="esm-odontogram-app">
      <div style={{ padding: '1rem 0' }}>
        <OdontogramNuevoBridge />
      </div>
    </AppErrorBoundary>
  );
}
