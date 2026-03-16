import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import PatientObservationGroupTable from '../../../ui/patient-observation-group-table/patient-observation-group-table.component';
import type { ConfigObject } from '../../../config-schema';

interface SummaryOfLaborAndPostpartumProps {
  patientUuid: string;
}

const SummaryOfLaborAndPostpartum: React.FC<SummaryOfLaborAndPostpartumProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig() as ConfigObject;
  const headerTitle = t('resumenPartoPuerperio', 'Resumen de Parto y Puerperio');
  const displayText = t('noDataAvailableDescription', 'No data available');
  const formWorkspace = config.formsList.SummaryOfLaborAndPostpartum;

  return (
    <PatientObservationGroupTable
      patientUuid={patientUuid}
      headerTitle={headerTitle}
      displayText={displayText}
      encounterType={config.encounterTypes.hospitalization}
      formUuid={config.formsList.SummaryOfLaborAndPostpartum}
      formWorkspace={formWorkspace}
    />
  );
};

export default SummaryOfLaborAndPostpartum;
