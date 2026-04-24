/**
 * Queue table cell displaying patient name as a clickable link to their chart,
 * with the most relevant identifier (DNI preferred, OpenMRS ID fallback).
 */

import { ConfigurableLink, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { type Config } from '../../../config-schema';
import { type EmergencyQueueEntry } from '../../../resources/emergency.resource';

/** Shared props interface for all emergency queue table cell components. */
export interface EmergencyQueueTableCellProps {
  queueEntry: EmergencyQueueEntry;
}

export const EmergencyQueueNameCell: React.FC<EmergencyQueueTableCellProps> = ({ queueEntry }) => {
  const config = useConfig<Config>();
  const dniTypeUuid = config.patientRegistration.defaultIdentifierTypeUuid;
  const openmrsIdTypeUuid = config.patientRegistration.openMrsIdIdentifierTypeUuid;

  const identifiers = queueEntry.patient.identifiers || [];
  const dni = identifiers.find((id) => id.identifierType?.uuid === dniTypeUuid);
  const openmrsId = identifiers.find((id) => id.identifierType?.uuid === openmrsIdTypeUuid);
  const patientName = queueEntry.patient.person?.display || queueEntry.patient.display;

  // Show DNI if available, otherwise show OpenMRS ID as fallback
  const identifierDisplay = dni?.identifier || openmrsId?.identifier;

  return (
    <ConfigurableLink to={`\${openmrsSpaBase}/patient/${queueEntry.patient.uuid}/chart`}>
      {patientName}
      {identifierDisplay ? ` - ${identifierDisplay}` : ''}
    </ConfigurableLink>
  );
};
