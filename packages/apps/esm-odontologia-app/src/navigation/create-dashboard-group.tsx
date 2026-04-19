import React from 'react';

import { DashboardGroupExtension } from './dashboard-group.component';

type DashboardGroupProps = {
  title: string;
  slotName: string;
  isExpanded?: boolean;
  basePath?: string;
};

export const createDashboardGroup = ({ title, slotName, isExpanded }: DashboardGroupProps) => {
  return ({ basePath }: { basePath: string }) => (
    <DashboardGroupExtension basePath={basePath} title={title} slotName={slotName} isExpanded={isExpanded} />
  );
};
