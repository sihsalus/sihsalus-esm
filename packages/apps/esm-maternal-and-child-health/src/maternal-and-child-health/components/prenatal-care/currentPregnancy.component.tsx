import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import type { ConfigObject } from '../../../config-schema';

interface CurrentPregnancyProps {
  patientUuid: string;
}

const CurrentPregnancy: React.FC<CurrentPregnancyProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('currentPregnancy', 'Embarazo Actual');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.currentPregnancy;

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={displayText}
      encounterType={config.encounterTypes.prenatalControl}
      formUuid={config.formsList.currentPregnancy}
      formWorkspace={formWorkspace}
    />
  );
};

export default CurrentPregnancy;
