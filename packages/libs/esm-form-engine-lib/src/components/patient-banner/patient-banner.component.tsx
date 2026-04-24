import { ComponentContext, Extension, useAssignedExtensions } from '@openmrs/esm-framework/src/internal';
import React, { useContext } from 'react';
import styles from './patient-banner.scss';

interface PatientBannerProps {
  patient?: fhir.Patient | null;
  hideActionsOverflow?: boolean;
}

const PatientBanner: React.FC<PatientBannerProps> = ({ patient, hideActionsOverflow }) => {
  const { moduleName } = useContext(ComponentContext);
  const extensions = useAssignedExtensions('patient-header-slot');

  return (
    <div className={styles.patientBannerContainer}>
      {moduleName
        ? extensions.map((extension) => (
            <ComponentContext.Provider
              key={extension.id}
              value={{
                moduleName,
                featureName: '',
                extension: {
                  extensionId: extension.id,
                  extensionSlotName: 'patient-header-slot',
                  extensionSlotModuleName: moduleName,
                },
              }}
            >
              <Extension
                state={{
                  patient,
                  patientUuid: patient?.id,
                  hideActionsOverflow,
                }}
              />
            </ComponentContext.Provider>
          ))
        : null}
    </div>
  );
};

export default PatientBanner;
