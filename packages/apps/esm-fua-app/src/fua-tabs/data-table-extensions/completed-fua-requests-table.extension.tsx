import React from 'react';
import FuaRequestTable from '../../fua/fuaRequestTable';

const CompletedFuaRequestsTable: React.FC = () => {
  return <FuaRequestTable statusFilter="completed" />;
};

export default CompletedFuaRequestsTable;
