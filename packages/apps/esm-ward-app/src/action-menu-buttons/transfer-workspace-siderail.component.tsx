import { ActionMenuButton, launchWorkspace, MovementIcon } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PatientTransferAndSwapSiderailIcon() {
  const { t } = useTranslation();
  const handler = () => {
    launchWorkspace('patient-transfer-swap-workspace');
  };
  return (
    <ActionMenuButton
      getIcon={(props) => <MovementIcon {...props} />}
      label={t('transfers', 'Transfers')}
      iconDescription={t('transfers', 'Transfers')}
      handler={handler}
      type="transfer-swap-bed-form"
    />
  );
}
