// altura-cuello-overview.component.tsx
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CardHeader,
  EmptyState,
  ErrorState,
} from '@openmrs/esm-patient-common-lib';
import { getPatientName, launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import { Button, DataTableSkeleton, InlineLoading } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import AlturaCuelloChart from './altura-cuello-chart.component';
import { usePrenatalMeasurements } from '../../hooks/usePrenatalMeasurements';
import type { ConfigObject } from '../../config-schema';
import styles from './altura-cuello-overview.scss';

interface AlturaCuelloOverviewProps {
  patient: fhir.Patient;
  patientUuid: string;
}

const AlturaCuelloOverview: React.FC<AlturaCuelloOverviewProps> = ({ patient, patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();

  const headerTitle = t('obstetricalCharts', 'Obstetrical Charts');
  const displayText = t('noMeasurementDataAvailable', 'No hay datos de mediciones disponibles');
  //const formWorkspace = config.formsList?.prenatalCare || 'prenatal-measurements-form';

  const launchForm = useCallback(() => {
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: 'OBST-003-ATENCIÓN PRENATAL' },
    });
  }, []);

  const patientName = getPatientName(patient);

  // Calcular semanas gestacionales actuales
  const gestationalWeeks = useMemo(() => {
    // Esta lógica dependerá de cómo manejen las fechas en su sistema
    // Por ejemplo, basado en la fecha de última menstruación (FUM)
    const lastMenstrualPeriod = patient?.extension?.find((ext) => ext.url === 'last-menstrual-period')?.valueDate;

    if (lastMenstrualPeriod) {
      const fumDate = new Date(lastMenstrualPeriod);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - fumDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return diffWeeks;
    }

    return undefined;
  }, [patient]);

  // Hook para obtener datos de mediciones prenatales
  const { data, isLoading, error } = usePrenatalMeasurements(patientUuid);

  // Transformar datos para el componente de gráfico
  const measurementData = useMemo(() => {
    if (!data?.length) return [];

    return data
      .map((measurement) => ({
        semana: measurement.gestationalWeek || 0,
        altura: measurement.uterineHeight || measurement.cervicalLength || 0,
        fecha: measurement.date,
      }))
      .filter((item) => item.semana > 0 && item.altura > 0);
  }, [data]);

  if (isLoading && !data) {
    return <DataTableSkeleton role="progressbar" aria-label={t('loadingData', 'Loading data...')} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (measurementData?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          {isLoading && <InlineLoading description={t('refreshing', 'Refreshing...')} status="active" />}
          {launchForm && (
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              onClick={launchForm}
              aria-label={t('addMeasurement', 'Agregar medición')}>
              {t('add', 'Add')}
            </Button>
          )}
        </CardHeader>

        <AlturaCuelloChart
          measurementData={measurementData}
          patientName={patientName}
          gestationalWeeks={gestationalWeeks}
        />
      </div>
    );
  }

  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchForm} />;
};

export default AlturaCuelloOverview;
