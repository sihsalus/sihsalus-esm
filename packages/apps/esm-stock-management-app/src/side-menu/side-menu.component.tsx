import { LeftNavMenu } from '@openmrs/esm-framework';
import React from 'react';

const SideMenu: React.FC = () => {
  console.debug('[SideMenu] rendering side menu');

  return (
    <>
      <LeftNavMenu />
      <div style={{ padding: '1rem', background: 'lightyellow', border: '2px dashed red' }}>
        <p>
          <strong>Debug:</strong> SideMenu loaded
        </p>
      </div>
    </>
  );
};

export default SideMenu;
