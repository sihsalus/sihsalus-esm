import { SkeletonText } from '@carbon/react';
import React from 'react';
import useRelativeHivEnrollment from '../hooks/useRelativeHivEnrollment';
import useRelativeHTSEncounter from '../hooks/useRelativeHTSEncounter';

import { getHivStatusBasedOnEnrollmentAndHTSEncounters } from './contact-list.resource';

interface HIVStatusProps {
  relativeUuid: string;
}

const HIVStatus: React.FC<HIVStatusProps> = ({ relativeUuid }) => {
  const { enrollment, isLoading } = useRelativeHivEnrollment(relativeUuid);
  const { encounters, isLoading: encounterLoading } = useRelativeHTSEncounter(relativeUuid);

  if (isLoading || encounterLoading) {
    return <SkeletonText />;
  }
  return <div>{getHivStatusBasedOnEnrollmentAndHTSEncounters(encounters, enrollment)}</div>;
};

export default HIVStatus;
