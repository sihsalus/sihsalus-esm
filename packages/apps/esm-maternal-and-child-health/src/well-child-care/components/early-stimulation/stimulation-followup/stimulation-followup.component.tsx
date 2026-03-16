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
import { useStimulationFollowup } from '../../../../hooks/useStimulationFollowup';
import type { ConfigObject } from '../../../../config-schema';
import styles from './stimulation-followup.scss';

interface StimulationFollowupProps {
  patientUuid: string;
}

const StimulationFollowup: React.FC<StimulationFollowupProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { lastEvaluationResult, lastEvaluationDate, hasStimulationLack, isLoading, error } =
    useStimulationFollowup(patientUuid);
  const headerTitle = t('esFollowUpTitle', 'Seguimiento del Desarrollo');

  const handleAdd = useCallback(() => {
    const formUuid = config.formsList.stimulationFollowupForm;
    if (!formUuid) {
      console.warn('Form UUID not configured for stimulationFollowupForm');
      return;
    }
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [config.formsList.stimulationFollowupForm]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact rowCount={4} columnCount={2} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  const riskLabel = hasStimulationLack
    ? t('esRisk', 'Riesgo')
    : lastEvaluationResult
      ? t('esNormal', 'Normal')
      : null;
  const riskTagType = hasStimulationLack ? 'red' : lastEvaluationResult ? 'green' : 'gray';

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <Tag type={riskTagType} size="sm">
          {riskLabel ?? t('noData', 'Sin datos')}
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
                {t('esLastEvaluation', 'Última evaluación')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastEvaluationResult ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('lastDate', 'Fecha')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastEvaluationDate ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('esStimulationRisk', 'Riesgo de estimulación')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {hasStimulationLack ? (
                  <Tag type="red" size="sm">{t('esRisk', 'Riesgo')}</Tag>
                ) : lastEvaluationResult ? (
                  <Tag type="green" size="sm">{t('esNormal', 'Normal')}</Tag>
                ) : (
                  <span className={styles.noData}>{t('noData', 'Sin datos')}</span>
                )}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </div>
  );
};

export default StimulationFollowup;
