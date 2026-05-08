import { useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { type ConfigObject } from '../../config-schema';
import FlagsList from '../flags-list.component';
import { type FlagsListExtensionConfig } from './extension-config-schema';

interface FlagsListExtensionProps {
  patientUuid: string;
}

const FlagsListExtension: React.FC<FlagsListExtensionProps> = ({ patientUuid }) => {
  const { tags } = useConfig<FlagsListExtensionConfig & ConfigObject>();
  return <FlagsList patientUuid={patientUuid} filterByTags={tags} />;
};

export default FlagsListExtension;
