import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import React from 'react';

import HelpMenu from './help-menu/help.component';

const Root: React.FC = () => {
  return (
    <AppErrorBoundary appName="esm-help-menu-app">
      <HelpMenu />
    </AppErrorBoundary>
  );
};

export default Root;
