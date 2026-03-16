import React, { useMemo } from 'react';
import { Friendship, UserFollow, Growth } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';

interface EarlyStimulationProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const EarlyStimulation: React.FC<EarlyStimulationProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'stimulationSessions',
        icon: Friendship,
        slotName: 'early-stimulation-sessions-slot',
      },
      {
        labelKey: 'stimulationFollowUp',
        icon: Growth,
        slotName: 'early-stimulation-followup-slot',
      },
      {
        labelKey: 'stimulationCounseling',
        icon: UserFollow,
        slotName: 'early-stimulation-counseling-slot',
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
      titleKey="earlyStimulation"
      tabs={tabs}
      ariaLabelKey="earlyStimulationTabs"
    />
  );
};
