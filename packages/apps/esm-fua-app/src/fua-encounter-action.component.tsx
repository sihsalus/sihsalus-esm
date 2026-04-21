import { Receipt } from '@carbon/react/icons';
import { ActionMenuButton } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

const FuaEncounterAction: React.FC = () => {
  const { t } = useTranslation();
  const launchFuaEncounterWorkspace = useLaunchWorkspaceRequiringVisit('fua-encounter-workspace');

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof Receipt>) => <Receipt {...props} />}
      label={t('createFua', 'Crear FUA')}
      iconDescription={t('createFua', 'Crear FUA')}
      handler={launchFuaEncounterWorkspace}
      type="fua-encounter"
    />
  );
};

export default FuaEncounterAction;
