import React, { useMemo } from 'react';
import { Eyedropper, Pills } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface ChildImmunizationProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const ChildImmunizationSchedule: React.FC<ChildImmunizationProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'vaccinationSchedule',
        icon: Eyedropper,
        slotName: 'vaccination-schedule-slot',
      },
      {
        labelKey: 'adverseReactions',
        icon: Pills,
        slotName: 'vaccination-appointment-slot',
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
      titleKey="childImmunizationSchedule"
      tabs={tabs}
      ariaLabelKey="immunizationTabs"
    />
  );
};
