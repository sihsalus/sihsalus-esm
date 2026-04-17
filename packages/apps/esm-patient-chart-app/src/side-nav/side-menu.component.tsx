import { LeftNavMenu, useLayoutType } from '@openmrs/esm-framework';
import React from 'react';

const SideMenuPanel: React.FC = () => {
  const layout = useLayoutType();

  return layout === 'large-desktop' && <LeftNavMenu />;
};

export default SideMenuPanel;
