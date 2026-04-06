import { Button } from '@carbon/react';
import { navigate, useConfig, launchWorkspace } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { type ConfigObject } from '../../config-schema';
import { type Appointment } from '../../types';
dayjs.extend(utc);
dayjs.extend(isToday);

interface CheckInButtonProps {
  patientUuid: string;
  appointment: Appointment;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ appointment, patientUuid }) => {
  const { checkInButton } = useConfig<ConfigObject>();
  const { t } = useTranslation();
  return (
    <>
      {checkInButton.enabled &&
        (dayjs(appointment.startDateTime).isAfter(dayjs()) || dayjs(appointment.startDateTime).isToday()) && (
          <Button
            size="sm"
            kind="tertiary"
            onClick={() =>
              checkInButton.customUrl
                ? navigate({
                    to: checkInButton.customUrl,
                    templateParams: { patientUuid: appointment.patient.uuid, appointmentUuid: appointment.uuid },
                  })
                : launchWorkspace('start-visit-workspace-form', {
                    patientUuid: patientUuid,
                    showPatientHeader: true,
                    openedFrom: 'appointments-check-in',
                  })
            }
          >
            {t('checkIn', 'Check in')}
          </Button>
        )}
    </>
  );
};

export default CheckInButton;
