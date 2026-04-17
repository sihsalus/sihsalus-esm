import { Tag, type TagProps } from '@carbon/react';
import React from 'react';

import { type ConfigConcepts, type Encounter } from '../types';
import { getObsFromEncounter, findObs } from '../utils/helpers';

export const renderTag = (
  encounter: Encounter,
  concept: string,
  statusColorMappings: Record<string, NonNullable<TagProps<'div'>['type']>>,
  config: ConfigConcepts,
) => {
  const columnStatus = getObsFromEncounter({ encounter: encounter, obsConcept: concept, config: config });
  const columnStatusObs = findObs(encounter, concept);

  if (columnStatus == '--') {
    return '--';
  }

  return (
    <Tag
      type={
        typeof columnStatusObs?.value === 'object' && 'uuid' in columnStatusObs.value
          ? statusColorMappings[columnStatusObs.value.uuid]
          : undefined
      }
      title={typeof columnStatus === 'string' ? columnStatus : columnStatus.name.name}
      style={{ minWidth: '80px' }}
    >
      {typeof columnStatus === 'object' ? columnStatus.name.name : columnStatus}
    </Tag>
  );
};
