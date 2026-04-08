import { Button, InlineLoading } from '@carbon/react';
import { showSnackbar, type DefaultWorkspaceProps } from '@openmrs/esm-framework';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import OdontogramNuevoBridge from '../components/OdontogramNuevoBridge';
import { useOdontogramEncounter } from '../hooks/useOdontogramEncounter';
import useOdontogramDataStore from '../store/odontogramDataStore';

interface OdontogramWorkspaceProps extends DefaultWorkspaceProps {
  patientUuid: string;
  encounterUuid?: string;
}

const OdontogramWorkspace: React.FC<OdontogramWorkspaceProps> = ({
  patientUuid,
  encounterUuid,
  closeWorkspace,
}) => {
  const { t } = useTranslation();
  const { save, isSaving } = useOdontogramEncounter();
  const setPatient = useOdontogramDataStore((s) => s.setPatient);
  const resetData = useOdontogramDataStore((s) => s.resetData);

  useEffect(() => {
    setPatient(patientUuid);
  }, [patientUuid, setPatient]);

  const handleSave = async () => {
    try {
      await save({ patientUuid, encounterUuid });
      showSnackbar({
        title: t('odontogramSaved', 'Odontogram saved'),
        kind: 'success',
        subtitle: t('odontogramSavedSubtitle', 'The odontogram findings have been saved successfully.'),
      });
      resetData();
      closeWorkspace();
    } catch {
      showSnackbar({
        title: t('odontogramSaveError', 'Error saving odontogram'),
        kind: 'error',
        subtitle: t('odontogramSaveErrorSubtitle', 'Could not save odontogram findings. Please try again.'),
      });
    }
  };

  return (
    <div>
      <OdontogramNuevoBridge />
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', justifyContent: 'flex-end' }}>
        <Button kind="secondary" onClick={() => closeWorkspace()}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <InlineLoading description={t('saving', 'Saving...')} /> : t('saveOdontogram', 'Save odontogram')}
        </Button>
      </div>
    </div>
  );
};

export default OdontogramWorkspace;
