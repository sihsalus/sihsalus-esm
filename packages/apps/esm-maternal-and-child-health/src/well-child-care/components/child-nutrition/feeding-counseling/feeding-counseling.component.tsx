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
import { useFeedingAssessment } from '../../../../hooks/useFeedingAssessment';
import type { ConfigObject } from '../../../../config-schema';
import styles from './feeding-counseling.scss';

interface FeedingCounselingProps {
  patientUuid: string;
}

const FeedingCounseling: React.FC<FeedingCounselingProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { feedingType, lastAssessmentDate, isBreastfeeding, isLoading, error } = useFeedingAssessment(patientUuid);
  const headerTitle = t('cnCounselingTitle', 'Consejería Alimentaria');

  const handleAdd = useCallback(() => {
    const formUuid = config.formsList.feedingCounselingForm;
    if (!formUuid) return;
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [config.formsList.feedingCounselingForm]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact rowCount={3} columnCount={2} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <Tag type={lastAssessmentDate ? 'green' : 'gray'} size="sm">
          {lastAssessmentDate ? t('completed', 'Completed') : t('pending', 'Pending')}
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
                {t('cnFeedingType', 'Tipo de alimentación')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {feedingType ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('cnBreastfeeding', 'Lactancia Materna')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {isBreastfeeding != null ? (
                  isBreastfeeding ? t('yes', 'Sí') : t('no', 'No')
                ) : (
                  <span className={styles.noData}>{t('noData', 'Sin datos')}</span>
                )}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('lastSession', 'Última sesión')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastAssessmentDate ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </div>
  );
};

export default FeedingCounseling;
