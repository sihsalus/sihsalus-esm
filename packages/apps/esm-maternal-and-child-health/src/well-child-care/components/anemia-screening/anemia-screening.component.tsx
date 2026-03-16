import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTableSkeleton,
  Tag,
  Button,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';
import { WarningFilled, CheckmarkFilled, Add } from '@carbon/react/icons';
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import { useAnemiaScreening } from '../../../hooks/useAnemiaScreening';
import type { ConfigObject } from '../../../config-schema';
import styles from './anemia-screening.scss';

interface AnemiaScreeningProps {
  patientUuid: string;
}

const AnemiaScreening: React.FC<AnemiaScreeningProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { lastHb, lastDate, isAnemic, nextDueDate, isLoading, error } = useAnemiaScreening(patientUuid);
  const headerTitle = t('anemiaScreening', 'Tamizaje de Anemia');

  const handleAdd = useCallback(() => {
    const formUuid = config.formsList.anemiaScreeningForm;
    if (!formUuid) {
      console.warn('Form UUID not configured for anemiaScreeningForm');
      return;
    }
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [config.formsList.anemiaScreeningForm]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact rowCount={3} columnCount={2} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        {lastHb !== null && (
          <Tag
            type={isAnemic ? 'red' : 'green'}
            size="sm"
            renderIcon={isAnemic ? WarningFilled : CheckmarkFilled}
          >
            {isAnemic ? t('anemic', 'Anemia') : t('normal', 'Normal')}
          </Tag>
        )}
        <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleAdd} iconDescription={t('add', 'Add')}>
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <div className={styles.container}>
        <StructuredListWrapper isCondensed>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('lastHb', 'Última Hb')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastHb !== null ? (
                  <span className={isAnemic ? styles.anemic : styles.normalValue}>{lastHb} g/dL</span>
                ) : (
                  <span className={styles.noData}>{t('noData', 'Sin datos')}</span>
                )}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('lastDate', 'Fecha')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {lastDate ?? <span className={styles.noData}>{t('noData', 'Sin datos')}</span>}
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell className={styles.label}>
                {t('nextScreening', 'Próximo tamizaje')}
              </StructuredListCell>
              <StructuredListCell className={styles.value}>
                {nextDueDate ?? <span className={styles.noData}>{t('pending', 'Pending')}</span>}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </div>
  );
};

export default AnemiaScreening;
