import React from 'react';
import FuaRequestTable from '../../fua/fuaRequestTable';

const InProgressFuaRequestsTable: React.FC = () => {
  return <FuaRequestTable statusFilter="in-progress" />;
};

export default InProgressFuaRequestsTable;
