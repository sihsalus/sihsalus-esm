import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import { useConfig } from '@openmrs/esm-framework';
import { useCREDSchedule, type CREDControlWithStatus } from '../../../hooks/useCREDSchedule';
import styles from './cred-matrix.scss';
import CredTile from './cred-tile';
import type { ConfigObject } from '../../../config-schema';

interface CredControlsMatrixProps {
  patientUuid: string;
}

const CredControlsMatrix: React.FC<CredControlsMatrixProps> = ({ patientUuid }) => {
  const { ageGroupsCRED } = useConfig<ConfigObject>();
  const { controls, completedCount, totalCount, overdueControls, isLoading, error } = useCREDSchedule(patientUuid);
  const { t } = useTranslation();

  const headerTitle = t('controlsAndAtentions', 'Atenciones y Controles');

  const groupedControls = useMemo(() => {
    const grouped: Record<string, CREDControlWithStatus[]> = {};

    ageGroupsCRED.forEach((group) => {
      grouped[group.label] = [];
    });

    controls.forEach((control) => {
      if (grouped[control.ageGroupLabel]) {
        grouped[control.ageGroupLabel].push(control);
      }
    });

    return grouped;
  }, [controls, ageGroupsCRED]);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact zebra />;
  if (error) return <ErrorState error={error} headerTitle={headerTitle} />;

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <div className={styles.clinicalDataHeaderActionItems}>
          <span className={styles.summaryItem}>
            {t('completedOf', '{{completed}} de {{total}} controles', {
              completed: completedCount,
              total: totalCount,
            })}
          </span>
          {overdueControls.length > 0 && (
            <span className={styles.overdueCount}>
              {t('overdueCount', '{{count}} vencidos', { count: overdueControls.length })}
            </span>
          )}
        </div>
      </CardHeader>
      <div className={styles.matrixScroll}>
        <div className={styles.matrixGrid}>
          {ageGroupsCRED.map((group) => {
            const groupControls = groupedControls[group.label] ?? [];
            return (
              <div key={group.label} className={styles.matrixColumn}>
                <div className={styles.columnHeader}>
                  <strong>{group.label}</strong>
                  {group.sublabel && <div className={styles.sublabel}>{group.sublabel}</div>}
                </div>
                <div className={styles.columnBody}>
                  {groupControls.map((control) => (
                    <CredTile
                      key={control.controlNumber}
                      uuid={control.encounterUuid}
                      controlNumber={control.controlNumber}
                      label={control.label}
                      date={control.encounterDate ?? control.appointmentDate ?? control.targetDate}
                      status={control.status}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CredControlsMatrix;
