import React, { useMemo } from 'react';
import { Favorite, UserFollow, ChartLineData } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface FamilyPlanningProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const FamilyPlanning: React.FC<FamilyPlanningProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'contraceptiveMethods',
        icon: Favorite,
        slotName: 'family-planning-methods-slot',
      },
      {
        labelKey: 'fpCounseling',
        icon: UserFollow,
        slotName: 'family-planning-counseling-slot',
      },
      {
        labelKey: 'fpFollowUp',
        icon: ChartLineData,
        slotName: 'family-planning-followup-slot',
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
      titleKey="familyPlanning"
      tabs={tabs}
      ariaLabelKey="familyPlanningTabs"
    />
  );
};
