import { type Patient } from '@openmrs/esm-framework';
import React from 'react';

import { useElementConfig } from '../../ward-view/ward-view.resource';

export interface WardPatientAddressProps {
  patient: Patient;
  id: string;
}

const WardPatientAddress: React.FC<WardPatientAddressProps> = ({ patient, id }) => {
  const preferredAddress = patient?.person?.preferredAddress;
  const config = useElementConfig('patientAddress', id);

  return (
    <>
      {config.fields?.map((field) =>
        preferredAddress?.[field] ? (
          <div key={String(field)}>{preferredAddress?.[field] as string}</div>
        ) : (
          <div key={String(field)} />
        ),
      )}
    </>
  );
};

export default WardPatientAddress;
