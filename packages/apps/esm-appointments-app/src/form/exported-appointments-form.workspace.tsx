import { type DefaultWorkspaceProps } from '@openmrs/esm-framework';
import React from 'react';
import type { Appointment, RecurringPattern } from '../types';
import AppointmentsForm from './appointments-form.workspace';

interface ExportedAppointmentsFormProps extends DefaultWorkspaceProps {
  patientUuid: string;
  appointment?: Appointment;
  recurringPattern?: RecurringPattern;
  context?: string;
}

/**
 * Workspace used to create or edit an appointment in the patient chart (or app with compatible workspaceGroup).
 * This wrapper exposes the appointments form as a standalone workspace that can be launched from outside
 * the appointments app (e.g. from the patient chart).
 */
const ExportedAppointmentsForm: React.FC<ExportedAppointmentsFormProps> = ({
  patientUuid,
  appointment,
  recurringPattern,
  context = 'creating',
  ...rest
}) => {
  return (
    <AppointmentsForm
      patientUuid={patientUuid}
      appointment={appointment}
      recurringPattern={recurringPattern}
      context={context}
      {...rest}
    />
  );
};

export default ExportedAppointmentsForm;
