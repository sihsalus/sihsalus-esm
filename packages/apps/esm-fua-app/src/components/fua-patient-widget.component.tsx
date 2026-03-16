import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton, Tag, Tile, Button } from '@carbon/react';
import { formatDate, launchWorkspace, useConfig } from '@openmrs/esm-framework';
import { View } from '@carbon/react/icons';
import { useFuasByPatient } from '../hooks/useFuaRequests';
import type { Config } from '../config-schema';
import styles from './fua-patient-widget.scss';

interface FuaPatientWidgetProps {
  patientUuid: string;
}

const ESTADO_TAG: Record<string, 'blue' | 'cyan' | 'gray' | 'green' | 'magenta' | 'red'> = {
  Pendiente: 'gray',
  'En Proceso': 'blue',
  Completado: 'green',
  'Enviado a SETI-SIS': 'cyan',
  Rechazado: 'red',
  Cancelado: 'magenta',
};

const FuaPatientWidget: React.FC<FuaPatientWidgetProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { fuaOrders, isLoading, isError } = useFuasByPatient(patientUuid);

  if (isLoading) {
    return <DataTableSkeleton showHeader={false} showToolbar={false} rowCount={3} columnCount={3} />;
  }

  if (isError) {
    return (
      <Tile>
        <p>{t('errorLoadingFua', 'Error al cargar FUA')}</p>
      </Tile>
    );
  }

  if (!fuaOrders.length) {
    return (
      <Tile>
        <p>{t('noFuaForPatient', 'No hay FUAs registrados para este paciente')}</p>
      </Tile>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      <ul className={styles.fuaList}>
        {fuaOrders.slice(0, 5).map((fua) => (
          <li key={fua.uuid} className={styles.fuaItem}>
            <div className={styles.fuaItemMain}>
              <span className={styles.fuaItemName}>{fua.numeroFua ?? fua.name}</span>
              <Tag type={ESTADO_TAG[fua.fuaEstado?.nombre] ?? 'gray'} size="sm">
                {fua.fuaEstado?.nombre ?? t('noStatus', 'Sin estado')}
              </Tag>
            </div>
            <div className={styles.fuaItemMeta}>
              <span>{formatDate(new Date(fua.fechaCreacion), { mode: 'standard', time: false })}</span>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={View}
                iconDescription={t('viewFua', 'Ver FUA')}
                hasIconOnly
                onClick={() => launchWorkspace('fua-viewer-workspace', { fuaId: fua.uuid })}
              />
            </div>
            {fua.observacionesSetiSis && (
              <div className={styles.fuaObsSetiSis}>
                <strong>SETI-SIS:</strong> {fua.observacionesSetiSis}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuaPatientWidget;
