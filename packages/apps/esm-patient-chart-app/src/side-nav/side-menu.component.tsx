import { LeftNavMenu, useLayoutType } from '@openmrs/esm-framework';
import React from 'react';

interface SideMenuPanelProps extends SideNavProps {}

const SideMenuPanel: React.FC<SideMenuPanelProps> = () => {
  const layout = useLayoutType();

  return layout === 'large-desktop' && <LeftNavMenu />;
};

export default SideMenuPanel;
