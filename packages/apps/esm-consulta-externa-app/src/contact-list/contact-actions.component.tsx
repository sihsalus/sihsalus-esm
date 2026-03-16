import { Button, ButtonSkeleton, Row } from '@carbon/react';
import { Microscope } from '@carbon/react/icons';
import { useConfig, launchWorkspace } from '@openmrs/esm-framework';
import React from 'react';
import type { ConfigObject } from '../config-schema';
import useRelativeHTSEncounter from '../hooks/useRelativeHTSEncounter';
import useRelativeHivEnrollment from '../hooks/useRelativeHivEnrollment';
import { getHivStatusBasedOnEnrollmentAndHTSEncounters } from './contact-list.resource';

interface ContactActionsProps {
  relativeUuid: string;
  baseLineHIVStatus: string | null;
}

const ContactActions: React.FC<ContactActionsProps> = ({ relativeUuid, baseLineHIVStatus }) => {
  const { enrollment, isLoading, error } = useRelativeHivEnrollment(relativeUuid);
  const { encounters, isLoading: encounterLoading } = useRelativeHTSEncounter(relativeUuid);

  const {
    formsList: { htsInitialTest },
  } = useConfig<ConfigObject>();

  if (isLoading || encounterLoading) {
    return (
      <Row>
        <ButtonSkeleton kind="tertiary" size="sm" hasIconOnly />
        <ButtonSkeleton kind="tertiary" size="sm" hasIconOnly />
      </Row>
    );
  }

  const hivStatus = getHivStatusBasedOnEnrollmentAndHTSEncounters(encounters, enrollment);
  //todo update to ask for visit first
  const handleLauchHTSInitialForm = () => {
    launchWorkspace('patient-form-entry-workspace', {
      workspaceTitle: 'HTS Initial form',
      formInfo: { encounterUuid: '', formUuid: htsInitialTest },
    });
  };

  return (
    <Row>
      {[hivStatus, baseLineHIVStatus].every((status) =>
        ['Unknown', 'Negative', 'NEGATIVE', 'UNKNOWN', null].includes(status),
      ) && (
        <Button
          kind="ghost"
          renderIcon={Microscope}
          iconDescription="Test"
          // hasIconOnly
          onClick={handleLauchHTSInitialForm}>
          Test
        </Button>
      )}
    </Row>
  );
};

export default ContactActions;
