import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, DataTableSkeleton, IconSwitch, InlineLoading } from '@carbon/react';
import { Add, Analytics, Table } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';
import { formatDate, parseDate, useConfig, useLayoutType, launchWorkspace2 } from '@openmrs/esm-framework';
import { useCurrentPregnancy } from '../../../../hooks/useCurrentPregnancy';
import PaginatedLabourHistory from './paginated-labour-history.component';
import LabourHistoryChart from './labour-history-chart.component';
import type { LabourHistoryTableRow } from '../../../common/types';

import styles from './labour-history-overview.scss';

interface LabourHistoryOverviewProps {
  patientUuid: string;
  pageSize?: number;
}

const LabourHistoryOverview: React.FC<LabourHistoryOverviewProps> = ({ patientUuid, pageSize = 10 }) => {
  const { t } = useTranslation();
  const headerTitle = t('labourHistorySummary', 'Labour history summary');
  const [chartView, setChartView] = useState(false);
  const isTablet = useLayoutType() === 'tablet';

  const config = useConfig();
  const { prenatalEncounter: data, error, isLoading, mutate } = useCurrentPregnancy(patientUuid);
  const formPrenatalUuid = config.formsList.deliveryOrAbortion;

  const launchLabourForm = useCallback(() => {
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formPrenatalUuid },
      encounterUuid: '',
    });
  }, [formPrenatalUuid]);

  const tableHeaders = useMemo(
    () => [
      { key: 'admissionDate', header: t('admissionDate', 'Admission Date'), isSortable: true },
      { key: 'terminationDate', header: t('terminationDate', 'Termination Date'), isSortable: true },
      { key: 'maternalPulse', header: t('maternalPulse', 'Maternal Pulse (bpm)'), isSortable: true },
      { key: 'systolicBP', header: t('systolicBP', 'Systolic BP (mmHg)'), isSortable: true },
      { key: 'diastolicBP', header: t('diastolicBP', 'Diastolic BP (mmHg)'), isSortable: true },
      { key: 'temperature', header: t('temperatureCelsius', 'Temperature (°C)'), isSortable: true },
      { key: 'maternalWeight', header: t('maternalWeight', 'Maternal Weight (Kg)'), isSortable: true },
      { key: 'gestationalAge', header: t('gestationalAge', 'Gestational Age (weeks)'), isSortable: true },
      { key: 'fetalHeartRate', header: t('fetalHeartRateBpm', 'Fetal heart rate (bpm)'), isSortable: true },
      { key: 'uterineHeight', header: t('uterineHeightCm', 'Uterine height (cm)'), isSortable: true },
      { key: 'dilatation', header: t('dilatation', 'Dilatation (cm)'), isSortable: true },
      { key: 'amnioticFluid', header: t('amnioticFluid', 'Amniotic Fluid'), isSortable: true },
      { key: 'deliveryType', header: t('deliveryType', 'Delivery type'), isSortable: true },
    ],
    [t],
  );

  const tableRows: LabourHistoryTableRow[] = useMemo(() => {
    if (!data?.obs) return [];

    const rows: LabourHistoryTableRow[] = [];
    let rowId = 0;

    data.obs.forEach((obs) => {
      const groupMembers = obs.groupMembers || [];
      const row: LabourHistoryTableRow = {
        id: `row-${rowId++}`,
        date: formatDate(parseDate(data.encounterDatetime), { mode: 'wide', time: true }),
      };

      if (Object.keys(row).length > 2) rows.push(row); // Solo agregar si tiene datos relevantes
    });

    return rows;
  }, [data]);

  if (isLoading && !data) return <DataTableSkeleton role="progressbar" />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;
  if (tableRows.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <div className={styles.backgroundDataFetchingIndicator}>
            <span>{isLoading ? <InlineLoading /> : null}</span>
          </div>
          <div className={styles.headerActionItems}>
            <ContentSwitcher onChange={(evt) => setChartView(evt.name === 'chartView')} size={isTablet ? 'md' : 'sm'}>
              <IconSwitch name="tableView" text="Table View">
                <Table size={16} />
              </IconSwitch>
              <IconSwitch name="chartView" text="Chart View">
                <Analytics size={16} />
              </IconSwitch>
            </ContentSwitcher>
            <span className={styles.divider}>|</span>
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              iconDescription="Add labour details"
              onClick={launchLabourForm}>
              {t('add', 'Add')}
            </Button>
          </div>
        </CardHeader>
        {chartView ? <LabourHistoryChart patientHistory={tableRows} /> : <></>}
      </div>
    );
  }
  return (
    <EmptyState
      displayText={t('labourHistorySummary', 'Labour history summary')}
      headerTitle={headerTitle}
      launchForm={launchLabourForm}
    />
  );
};

export default LabourHistoryOverview;
