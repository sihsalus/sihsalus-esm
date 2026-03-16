import React from 'react';
import FuaRequestTable from '../../fua/fuaRequestTable';

const AllFuaRequestsTable: React.FC = () => {
  return <FuaRequestTable statusFilter="all" />;
};

export default AllFuaRequestsTable;
