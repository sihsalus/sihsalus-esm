import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton, Tag, Button, ProgressBar } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import { launchWorkspace2, useConfig } from '@openmrs/esm-framework';
import { useSupplementationTracker } from '../../../hooks/useSupplementationTracker';
import type { ConfigObject } from '../../../config-schema';
import styles from './supplementation-tracker.scss';

interface SupplementationTrackerProps {
  patientUuid: string;
}

const SupplementationTracker: React.FC<SupplementationTrackerProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigObject>();
  const { delivered, total, percentage, isComplete, isLoading, error } = useSupplementationTracker(patientUuid);
  const headerTitle = t('mmnSupplementation', 'Suplementación MMN');

  const handleAdd = useCallback(() => {
    const formUuid = config.formsList.supplementationForm;
    if (!formUuid) {
      console.warn('Form UUID not configured for supplementationForm');
      return;
    }
    launchWorkspace2('patient-form-entry-workspace', {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [config.formsList.supplementationForm]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" compact rowCount={2} columnCount={2} />;
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={headerTitle}>
        <Tag type={isComplete ? 'green' : 'blue'} size="sm">
          {isComplete ? t('complete', 'Completo') : t('inProgress', 'En curso')}
        </Tag>
        <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleAdd} iconDescription={t('add', 'Add')}>
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <div className={styles.container}>
        <div className={styles.progressRow}>
          <div className={styles.progressBarWrapper}>
            <ProgressBar
              label={`${delivered}/${total} ${t('sachets', 'sobres')}`}
              value={percentage}
              size="small"
              status={isComplete ? 'finished' : 'active'}
            />
          </div>
          <span className={styles.percentageLabel}>{Math.round(percentage)}%</span>
        </div>
        <p className={styles.helperText}>
          {t('mmnDescription', 'Directiva 068: 1 sobre diario desde los 6 meses')}
        </p>
      </div>
    </div>
  );
};

export default SupplementationTracker;
