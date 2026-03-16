import React, { useMemo } from 'react';
import { UserFollow, Task, ChartLineData } from '@carbon/react/icons';
import { usePatient } from '@openmrs/esm-framework';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface PrenatalCareProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const PrenatalCare: React.FC<PrenatalCareProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'maternalHistory',
        icon: UserFollow,
        slotName: 'prenatal-maternal-history-slot',
      },
      {
        labelKey: 'currentPregnancy',
        icon: Task,
        slotName: 'prenatal-current-pregnancy-slot',
      },
      {
        labelKey: 'prenatalAttention',
        icon: ChartLineData,
        slotName: 'prenatal-care-chart-slot',
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
      titleKey="prenatalCare"
      tabs={tabs}
      ariaLabelKey="prenatalCareTabs"
    />
  );
};
