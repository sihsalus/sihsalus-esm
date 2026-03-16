import { useConfig } from '@openmrs/esm-framework';
import React from 'react';
import type { ConfigObject } from '../config-schema';
import GenericConditionsOverview from '../ui/conditions-filter/generic-conditions-overview.component';

interface AntecedentesPatologicosProps {
  patientUuid: string;
}

const AntecedentesPatologicos: React.FC<AntecedentesPatologicosProps> = ({ patientUuid }) => {
  const config = useConfig<ConfigObject>();

  // Get configuration for Antecedentes Patológicos
  const conceptSetConfig = config?.conditionConceptSets?.antecedentesPatologicos;

  if (!conceptSetConfig) {
    console.error('Configuration for Antecedentes Patológicos not found');
    return null;
  }

  return (
    <GenericConditionsOverview
      patientUuid={patientUuid}
      conceptSetUuid={conceptSetConfig.uuid}
      title={conceptSetConfig.title}
      workspaceFormId="antecedentes-patologicos-form-workspace"
      enableAdd={true}
      urlPath="AntecedentesPatologicos"
    />
  );
};

export default AntecedentesPatologicos;
