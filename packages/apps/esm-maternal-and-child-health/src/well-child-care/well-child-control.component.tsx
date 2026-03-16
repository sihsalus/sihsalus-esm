import React, { useMemo } from 'react';
import { Friendship, Calendar, ReminderMedical, Growth } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';

interface WellChildControlProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const WellChildControl: React.FC<WellChildControlProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'following',
        icon: Friendship,
        slotName: 'cred-following-slot',
      },
      {
        labelKey: 'credControls',
        icon: Calendar,
        slotName: 'cred-schedule-slot',
      },
      {
        labelKey: 'desarrollo',
        icon: Growth,
        slotName: 'cred-development-slot',
      },
      {
        labelKey: 'additionalServices',
        icon: ReminderMedical,
        slotName: 'additional-health-services-slot',
      },
    ],
    [],
  );

  if (!patient || !patientUuid) {
    return null;
  }

  return (
    <TabbedDashboard
      patient={patient}
      patientUuid={patientUuid}
      titleKey="wellChildCare"
      tabs={tabs}
      ariaLabelKey="wellChildCareTabs"
    />
  );
};
