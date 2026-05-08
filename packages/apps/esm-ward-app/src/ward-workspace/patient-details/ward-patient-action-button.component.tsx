import { ActionMenuButton2, UserAvatarIcon } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

export default function WardPatientActionButton() {
  const { t } = useTranslation();

  return (
    <ActionMenuButton2
      icon={(props) => <UserAvatarIcon {...props} />}
      label={t('patient', 'Patient')}
      workspaceToLaunch={{
        workspaceName: 'ward-patient-workspace',
      }}
    />
  );
}
