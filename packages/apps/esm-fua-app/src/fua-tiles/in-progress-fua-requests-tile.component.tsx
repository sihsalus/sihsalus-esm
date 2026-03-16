import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFuaRequests } from '../hooks/useFuaRequests';
import FuaSummaryTile from '../components/summary-tiles/summary-tile.component';

const InProgressFuaRequestsTile = () => {
  const { t } = useTranslation();
  const { fuaOrders } = useFuaRequests({ status: 'IN_PROGRESS' });

  return (
    <FuaSummaryTile
      label={t('activeFuas', 'FUAs activos')}
      value={fuaOrders?.length}
      headerLabel={t('inProcessHeader', 'En Proceso')}
    />
  );
};

export default InProgressFuaRequestsTile;
