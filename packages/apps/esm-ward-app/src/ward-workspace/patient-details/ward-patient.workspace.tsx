import { attach, ExtensionSlot, useConfig } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React from 'react';

import { type WardConfigObject } from '../../config-schema';
import { type WardPatientWorkspaceProps } from '../../types';
import WardPatientWorkspaceBanner from '../patient-banner/patient-banner.component';

import styles from './ward-patient.style.scss';

attach('ward-patient-workspace-header-slot', 'patient-vitals-info');

export default function WardPatientWorkspace({ wardPatient }: WardPatientWorkspaceProps) {
  const { patient } = wardPatient ?? {};
  const { hideWorkspaceVitalsLinks } = useConfig<WardConfigObject>();
  const extensionSlotState = { patient, patientUuid: patient?.uuid, hideLinks: hideWorkspaceVitalsLinks };

  return (
    <>
      {wardPatient && (
        <div className={classNames(styles.workspaceContainer, styles.patientWorkspace)}>
          <WardPatientWorkspaceBanner {...{ wardPatient }} />
          <ExtensionSlot name="ward-patient-workspace-header-slot" state={extensionSlotState} />
          <ExtensionSlot
            name="ward-patient-workspace-content-slot"
            state={extensionSlotState}
            className={styles.patientWorkspaceContentSlot}
          />
        </div>
      )}
    </>
  );
}
