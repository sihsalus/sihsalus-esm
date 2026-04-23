import { Receipt } from '@carbon/react/icons';
import { ActionMenuButton2 } from '@openmrs/esm-framework';
import { type PatientChartWorkspaceActionButtonProps, useStartVisitIfNeeded } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

const FuaEncounterAction: React.FC<PatientChartWorkspaceActionButtonProps> = ({ groupProps: { patientUuid } }) => {
  const { t } = useTranslation();
  const startVisitIfNeeded = useStartVisitIfNeeded(patientUuid);

  return (
    <ActionMenuButton2
      icon={(props: ComponentProps<typeof Receipt>) => <Receipt {...props} />}
      label={t('createFua', 'Crear FUA')}
      workspaceToLaunch={{
        workspaceName: 'fua-encounter-workspace',
      }}
      onBeforeWorkspaceLaunch={startVisitIfNeeded}
    />
  );
};

export default FuaEncounterAction;
