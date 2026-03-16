import { useConfig } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps } from '../types';
import React from 'react';
import type { ConfigObject } from '../config-schema';
import ConditionsFormWorkspace from '../ui/conditions-filter/conditions-form.workspace';

interface AntecedentesPatologicosFormWorkspaceProps extends DefaultPatientWorkspaceProps {}

const AntecedentesPatologicosFormWorkspace: React.FC<AntecedentesPatologicosFormWorkspaceProps> = (props) => {
  const config = useConfig<ConfigObject>();

  // Get configuration for Antecedentes Patológicos
  const conceptSetConfig = config?.conditionConceptSets?.antecedentesPatologicos;

  if (!conceptSetConfig) {
    console.error('Configuration for Antecedentes Patológicos not found');
    return null;
  }

  // Pass the conceptSet configuration to the generic workspace
  const workspaceProps = {
    conceptSetUuid: conceptSetConfig.uuid,
    title: conceptSetConfig.title,
  };

  return <ConditionsFormWorkspace {...props} formContext="creating" workspaceProps={workspaceProps} />;
};

export default AntecedentesPatologicosFormWorkspace;
