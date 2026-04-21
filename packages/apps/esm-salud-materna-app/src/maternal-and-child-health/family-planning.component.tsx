import { Favorite, UserFollow, ChartLineData } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import React, { useMemo } from 'react';

import { TabbedDashboard } from '@sihsalus/esm-sihsalus-shared';
import type { TabConfig } from '@sihsalus/esm-sihsalus-shared';

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
