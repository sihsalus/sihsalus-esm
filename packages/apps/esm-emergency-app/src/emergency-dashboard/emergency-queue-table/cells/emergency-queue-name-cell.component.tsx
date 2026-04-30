/**
 * Queue table cell displaying patient name as a clickable link to their chart,
 * with the most relevant identity document (DNI preferred, HCE fallback).
 */

import { ConfigurableLink, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { type Config } from '../../../config-schema';
import { type EmergencyQueueEntry } from '../../../resources/emergency.resource';

/** Shared props interface for all emergency queue table cell components. */
export interface EmergencyQueueTableCellProps {
  queueEntry: EmergencyQueueEntry;
}

const preferredIdentifierNames = ['DNI', 'CE', 'Pasaporte', 'PASS', 'DIE', 'CNV'];

export const EmergencyQueueNameCell: React.FC<EmergencyQueueTableCellProps> = ({ queueEntry }) => {
  const config = useConfig<Config>();
  const hceTypeUuid = config.patientRegistration.openMrsIdIdentifierTypeUuid;

  const identifiers = queueEntry.patient.identifiers || [];
  const preferredIdentifier =
    preferredIdentifierNames
      .map((identifierName) =>
        identifiers.find((id) => id.identifierType?.display?.toLowerCase() === identifierName.toLowerCase()),
      )
      .find(Boolean) ?? identifiers.find((id) => id.identifierType?.uuid === hceTypeUuid);
  const patientName = queueEntry.patient.person?.display || queueEntry.patient.display;

  return (
    <ConfigurableLink to={`\${openmrsSpaBase}/patient/${queueEntry.patient.uuid}/chart`}>
      {patientName}
      {preferredIdentifier
        ? ` - ${preferredIdentifier.identifierType?.display}: ${preferredIdentifier.identifier}`
        : ''}
    </ConfigurableLink>
  );
};
