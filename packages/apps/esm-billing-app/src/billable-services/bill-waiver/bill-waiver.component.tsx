import { ExtensionSlot, UserHasAccess } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { useBills } from '../../billing.resource';
import styles from './bill-waiver.scss';
import PatientBills from './patient-bills.component';

const BillWaiver: React.FC = () => {
  const [patientUuid, setPatientUuid] = useState<string>('');
  const { bills } = useBills(patientUuid);

  const filterBills = bills.filter((bill) => bill?.status !== 'PAID' && patientUuid === bill.patientUuid) ?? [];

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <div className={styles.billWaiverContainer}>
        <ExtensionSlot
          name="patient-search-bar-slot"
          state={{
            selectPatientAction: (patientUuid) => setPatientUuid(patientUuid),
            buttonProps: {
              kind: 'primary',
            },
          }}
        />

        <PatientBills patientUuid={patientUuid} bills={filterBills} setPatientUuid={setPatientUuid} />
      </div>
    </UserHasAccess>
  );
};

export default BillWaiver;
