import { Button, InlineLoading, InlineNotification, Layer } from '@carbon/react';
import { Launch } from '@carbon/react/icons';
import { useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { moduleName } from '../constants';
import { useAdmissions } from '../resources/admissions.resource';
import styles from './admission-home.scss';

interface AdmissionConfig {
  admissionReportPageSize?: number;
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'short' }).format(new Date(value));
}

function formatTime(value?: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-PE', { timeStyle: 'short' }).format(new Date(value));
}

export default function AdmissionHome() {
  const { t } = useTranslation(moduleName);
  const config = useConfig() as AdmissionConfig;
  const { admissions, error, isLoading } = useAdmissions(config.admissionReportPageSize ?? 50);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>{t('admissionReportByUps', 'Reporte de admisiones por UPS')}</h1>
          <p>{t('admissionReportSummary', 'Admisiones recientes agrupables por servicio/UPS, ubicación y estado.')}</p>
        </div>
        <Button
          kind="secondary"
          renderIcon={Launch}
          href={`${globalThis.getOpenmrsSpaBase().slice(0, -1)}/admission/merge`}
        >
          {t('mergeDuplicatePatients', 'Fusionar historias duplicadas')}
        </Button>
      </header>

      {isLoading ? <InlineLoading description={t('loadingAdmissions', 'Cargando admisiones')} /> : null}
      {error ? (
        <InlineNotification
          kind="error"
          lowContrast
          title={t('admissionReportError', 'No se pudo cargar el reporte de admisiones')}
        />
      ) : null}

      <Layer>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('date', 'Fecha')}</th>
                <th>{t('time', 'Hora')}</th>
                <th>{t('patient', 'Paciente')}</th>
                <th>{t('medicalRecord', 'HC')}</th>
                <th>{t('upsService', 'UPS/servicio')}</th>
                <th>{t('location', 'Ubicación')}</th>
                <th>{t('status', 'Estado')}</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((admission) => (
                <tr key={admission.uuid}>
                  <td>{formatDate(admission.startDatetime)}</td>
                  <td>{formatTime(admission.startDatetime)}</td>
                  <td>
                    {admission.patientUuid ? (
                      <Link to={`/patient/${admission.patientUuid}`} className={styles.patientLink}>
                        {admission.patientName}
                      </Link>
                    ) : (
                      admission.patientName
                    )}
                  </td>
                  <td>{admission.medicalRecordNumber}</td>
                  <td>{admission.service}</td>
                  <td>{admission.location}</td>
                  <td>{admission.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && admissions.length === 0 ? (
            <p className={styles.empty}>{t('noAdmissionsFound', 'No se encontraron admisiones recientes.')}</p>
          ) : null}
        </div>
      </Layer>
    </main>
  );
}
