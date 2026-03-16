import React, { useMemo } from 'react';
import { Activity, Stethoscope } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface PostnatalCareProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const PostnatalCare: React.FC<PostnatalCareProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'immediatePostpartum',
        icon: Activity,
        slotName: 'postnatal-care-immediate-slot',
      },
      {
        labelKey: 'postnatalControls',
        icon: Stethoscope,
        slotName: 'postnatal-care-controls-slot',
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
      titleKey="postnatalCare"
      tabs={tabs}
      ariaLabelKey="postnatalCareTabs"
    />
  );
};
