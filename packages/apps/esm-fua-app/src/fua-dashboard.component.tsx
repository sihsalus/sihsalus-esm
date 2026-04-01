import { useDefineAppContext } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FuaHeader } from './fua/fua-header';
import styles from './fua-dashboard.scss';
import FuaOrdersTabs from './fua-tabs/fua-tabs.component';
import FuaSummaryTiles from './fua-tiles/fua-summary-tiles.component';
import { type DateFilterContext } from './types';

const FuaDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  const contextValue = useMemo<DateFilterContext>(() => ({ dateRange, setDateRange }), [dateRange]);
  useDefineAppContext<DateFilterContext>('fua-date-filter', contextValue);

  return (
    <div className={styles.dashboard}>
      <FuaHeader title={t('fuaRequests', 'Solicitudes de Formato Único de Atención')} />
      <FuaSummaryTiles />
      <FuaOrdersTabs />
    </div>
  );
};

export default FuaDashboard;
