import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePatient, launchWorkspace2 } from '@openmrs/esm-framework';
import { EmptyState } from '@openmrs/esm-patient-common-lib';

const AdverseReactionsSummary: React.FC = () => {
  const { t } = useTranslation();
  const { patientUuid } = usePatient();
  const headerTitle = t('adverseReactions', 'Reacciones Adversas a Vacunas');
  const displayText = t('adverseReactions', 'Reacciones Adversas a Vacunas');

  const launchAdverseReactionForm = useCallback(() => {
    launchWorkspace2('adverse-reaction-form-workspace', {
      patientUuid,
    });
  }, [patientUuid]);

  // TODO: Replace with actual data hook when backend is ready
  return <EmptyState displayText={displayText} headerTitle={headerTitle} launchForm={launchAdverseReactionForm} />;
};

export default AdverseReactionsSummary;
