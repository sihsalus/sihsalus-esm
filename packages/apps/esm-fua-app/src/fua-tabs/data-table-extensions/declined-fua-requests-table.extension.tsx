import React from 'react';
import FuaRequestTable from '../../fua/fuaRequestTable';

const DeclinedFuaRequestsTable: React.FC = () => {
  return <FuaRequestTable statusFilter="declined" />;
};

export default DeclinedFuaRequestsTable;
