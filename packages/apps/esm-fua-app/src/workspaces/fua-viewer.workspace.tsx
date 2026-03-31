import React from 'react';

import FuaHtmlViewer from '../components/fua-html-viewer.component';

interface FuaViewerWorkspaceProps {
  fuaId?: string;
  closeWorkspace?: () => void;
}

const FuaViewerWorkspace: React.FC<FuaViewerWorkspaceProps> = ({ fuaId, closeWorkspace: _closeWorkspace }) => {

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FuaHtmlViewer fuaId={fuaId} />
    </div>
  );
};

export default FuaViewerWorkspace;
