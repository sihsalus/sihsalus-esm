import { Exit } from '@carbon/react/icons';
import { ActionMenuButton, launchWorkspace } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PatientDischargeSideRailIcon() {
  const { t } = useTranslation();
  const handler = () => {
    launchWorkspace('patient-discharge-workspace');
  };
  return (
    <ActionMenuButton
      getIcon={(props) => <Exit {...props} />}
      label={t('discharge', 'Discharge')}
      iconDescription={t('discharge', 'Discharge')}
      handler={handler}
      type="ward-patient-discharge"
    />
  );
}
