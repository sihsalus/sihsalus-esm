import React from 'react';

import FuaRequestTable from '../../fua/fuaRequestTable';

const EnvioFuasTable: React.FC = () => {
  return <FuaRequestTable statusFilter="declined" />;
};

export default EnvioFuasTable;
