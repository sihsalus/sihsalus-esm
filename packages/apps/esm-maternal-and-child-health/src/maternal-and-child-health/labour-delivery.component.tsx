import React, { useMemo } from 'react';
import { Report, ChartMultitype } from '@carbon/react/icons';
import { BabyIcon, usePatient } from '@openmrs/esm-framework';
import TabbedDashboard from '../ui/tabbed-dashboard/tabbed-dashboard.component';
import type { TabConfig } from '../ui/tabbed-dashboard/tabbed-dashboard.component';

export interface LabourDeliveryProps {
  patient?: fhir.Patient | null;
  patientUuid?: string | null;
}

export const LabourDelivery: React.FC<LabourDeliveryProps> = ({
  patient: patientProp,
  patientUuid: patientUuidProp,
}) => {
  const { patient: hookPatient, patientUuid: hookPatientUuid } = usePatient();
  const patient = patientProp ?? hookPatient;
  const patientUuid = patientUuidProp ?? hookPatientUuid;
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        labelKey: 'summaryOfLaborAndPostpartum',
        icon: Report,
        slotName: 'labour-delivery-summary-slot',
      },
      {
        labelKey: 'deliveryOrAbortion',
        icon: BabyIcon,
        slotName: 'labour-delivery-delivery-abortion-slot',
      },
      {
        labelKey: 'partograph',
        icon: ChartMultitype,
        slotName: 'labour-delivery-partograph-slot',
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
      titleKey="labourAndDelivery"
      tabs={tabs}
      ariaLabelKey="labourAndDeliveryTabs"
    />
  );
};
