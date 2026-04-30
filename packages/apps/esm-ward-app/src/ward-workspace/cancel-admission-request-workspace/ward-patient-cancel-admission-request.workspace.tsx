import React from 'react';
import type { WardPatientWorkspaceDefinition } from '../../types';
import CancelAdmissionRequestWorkspace from './cancel-admission-request.workspace';

/**
 * This is the workspace that is rendered when clicking on the 'X' button on a Patient Card
 * for a patient with a pending transfer request to a different location.
 * It wraps the existing CancelAdmissionRequestWorkspace using the Workspace v2 API.
 */
const WardPatientCancelAdmissionRequestWorkspace: React.FC<WardPatientWorkspaceDefinition> = ({
  closeWorkspace,
  groupProps: { wardPatient },
}) => {
  return (
    <CancelAdmissionRequestWorkspace
      closeWorkspace={closeWorkspace as never}
      closeWorkspaceWithSavedChanges={closeWorkspace as never}
      promptBeforeClosing={() => {}}
      setTitle={() => {}}
      wardPatient={wardPatient}
    />
  );
};

export default WardPatientCancelAdmissionRequestWorkspace;
