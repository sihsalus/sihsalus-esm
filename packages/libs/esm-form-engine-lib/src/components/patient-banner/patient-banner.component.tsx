import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './patient-banner.scss';

interface PatientBannerProps {
  patient?: fhir.Patient | null;
  hideActionsOverflow?: boolean;
}

const PatientBanner: React.FC<PatientBannerProps> = ({ patient, hideActionsOverflow }) => {
  return (
    <div className={styles.patientBannerContainer}>
      <ExtensionSlot
        name="patient-header-slot"
        state={{
          patient,
          patientUuid: patient?.id,
          hideActionsOverflow,
        }}
      />
    </div>
  );
};

export default PatientBanner;
