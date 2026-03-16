import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useDefineAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import FuaOrdersTabs from './fua-tabs/fua-tabs.component';
import FuaSummaryTiles from './fua-tiles/fua-summary-tiles.component';
import { FuaHeader } from './fua/fua-header';
import styles from './fua-dashboard.scss';

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
