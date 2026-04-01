import React from 'react';
import { useTranslation } from 'react-i18next';

import FuaSummaryTile from '../components/summary-tiles/summary-tile.component';
import { useFuaRequests } from '../hooks/useFuaRequests';

const CompletedFuaRequestsTile = () => {
  const { t } = useTranslation();
  const { fuaOrders } = useFuaRequests({ status: 'COMPLETED', excludeCanceled: false });

  return (
    <FuaSummaryTile
      label={t('completed', 'Completed')}
      value={fuaOrders?.length}
      headerLabel={t('completedHeader', 'Atenciones Completadas')}
    />
  );
};

export default CompletedFuaRequestsTile;
