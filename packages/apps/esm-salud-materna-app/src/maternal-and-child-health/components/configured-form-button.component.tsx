import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { launchWorkspace2 } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { formEntryWorkspace } from '../../types';

type ConfiguredFormButtonProps = {
  formUuid: string;
  label: string;
};

const ConfiguredFormButton: React.FC<ConfiguredFormButtonProps> = ({ formUuid, label }) => {
  const handleLaunchForm = useCallback(() => {
    if (!formUuid) {
      console.warn('Form UUID not configured');
      return;
    }

    launchWorkspace2(formEntryWorkspace, {
      form: { uuid: formUuid },
      encounterUuid: '',
    });
  }, [formUuid]);

  return (
    <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleLaunchForm} iconDescription={label}>
      {label}
    </Button>
  );
};

export default ConfiguredFormButton;
