import { Button } from '@carbon/react';
import { launchWorkspace } from '@openmrs/esm-framework';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import OdontogramNuevoBridge from '../components/OdontogramNuevoBridge';
import useOdontogramDataStore from '../store/odontogramDataStore';

interface OdontogramDashboardProps {
  patientUuid: string;
}

const OdontogramDashboard: React.FC<OdontogramDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const setPatient = useOdontogramDataStore((s) => s.setPatient);

  useEffect(() => {
    setPatient(patientUuid);
  }, [patientUuid, setPatient]);

  const handleLaunchWorkspace = useCallback(() => {
    launchWorkspace('odontogram-form-workspace', { patientUuid });
  }, [patientUuid]);

  return (
    <div>
      <CardHeader title={t('odontogram', 'Odontograma')}>
        <Button kind="ghost" size="sm" onClick={handleLaunchWorkspace}>
          {t('registerFindings', 'Registrar hallazgos')}
        </Button>
      </CardHeader>
      <div style={{ overflowX: 'auto', padding: '0 1rem 1rem' }}>
        <OdontogramNuevoBridge readOnly />
      </div>
    </div>
  );
};

export default OdontogramDashboard;
