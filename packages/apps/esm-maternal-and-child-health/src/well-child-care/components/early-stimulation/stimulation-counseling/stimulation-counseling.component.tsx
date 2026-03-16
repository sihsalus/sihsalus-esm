import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  Button,
  DataTableSkeleton,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import { useStimulationCounseling } from '../../../../hooks/useStimulationCounseling';
import type { ConfigObject } from '../../../../config-schema';
import styles from './stimulation-counseling.scss';

interface StimulationCounselingProps {
  patientUuid: string;
}

const StimulationCounseling: React.FC<StimulationCounselingProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { totalSessions, lastCounselingDate, lastCounselingResult, isLoading, error } =
    useStimulationCounseling(patientUuid);
  const headerTitle = t('esCounselingTitle', 'Consejería a Padres');

  const handleAdd = useCallback(() => {
    const formUuid = config.formsList.stimulationCounselingForm;
    if (!formUuid) {
      console.warn('Form UUID not configured for stimulationCounselingForm');
      return;
    }
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [config.formsList.stimulationCounselingForm]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact rowCount={3} columnCount={2} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <Tag type={totalSessions ? 'blue' : 'gray'} size="sm">
          {totalSessions ? `${totalSessions} ${t('sessions', 'sesiones')}` : t('noData', 'Sin datos')}
        </Tag>
        <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleAdd} iconDescription={t('add', 'Add')}>
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <div className={styles.container}>
        <StructuredListWrapper isCondensed>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('esCounselingSessions', 'Sesiones de consejería')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {totalSessions ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('esLastCounselingResult', 'Último resultado')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastCounselingResult ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('lastSession', 'Última sesión')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastCounselingDate ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </div>
  );
};

export default StimulationCounseling;
