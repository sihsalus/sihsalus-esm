import { ExtensionSlot, usePatient, Workspace2 } from '@openmrs/esm-framework';
import {
  type DefaultPatientWorkspaceProps,
  launchPatientWorkspace,
  type PatientWorkspace2DefinitionProps,
  useVisitOrOfflineVisit,
} from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { type Form } from '../types';
import FormsDashboard from './forms-dashboard.component';
import styles from './forms-dashboard-workspace.scss';

void React;

type Workspace2FormsWorkspaceProps = PatientWorkspace2DefinitionProps<object, object>;
type LegacyFormsWorkspaceProps = DefaultPatientWorkspaceProps;
type FormsWorkspaceProps = Workspace2FormsWorkspaceProps | LegacyFormsWorkspaceProps;

function isWorkspace2Props(props: FormsWorkspaceProps): props is Workspace2FormsWorkspaceProps {
  return 'groupProps' in props && 'launchChildWorkspace' in props;
}

export default function FormsWorkspace(props: FormsWorkspaceProps) {
  const { t } = useTranslation();
  const patientUuid = isWorkspace2Props(props) ? props.groupProps.patientUuid : props.patientUuid;
  const patientFromStore = isWorkspace2Props(props) ? props.groupProps.patient : null;
  const visitContextFromStore = isWorkspace2Props(props) ? props.groupProps.visitContext : null;
  const { patient } = usePatient(patientUuid);
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid);
  const resolvedPatient = patientFromStore ?? patient;
  const resolvedVisitContext = visitContextFromStore ?? currentVisit;

  const content = (
    <div className={styles.container}>
      <ExtensionSlot name="visit-context-header-slot" state={{ patientUuid }} />
      {resolvedPatient ? (
        <FormsDashboard
          patient={resolvedPatient}
          visitContext={resolvedVisitContext}
          handleFormOpen={(form: Form, encounterUuid?: string, handlePostResponse?: () => void) => {
            if (isWorkspace2Props(props)) {
              void props.launchChildWorkspace('patient-form-entry-workspace-v2', {
                form,
                encounterUuid,
                handlePostResponse,
              });
            } else {
              launchPatientWorkspace('patient-form-entry-workspace', {
                form,
                encounterUuid,
                handlePostResponse,
              });
            }
          }}
        />
      ) : null}
    </div>
  );

  if (isWorkspace2Props(props)) {
    return (
      <Workspace2 title={t('clinicalForms', 'Clinical forms')} hasUnsavedChanges={false}>
        {content}
      </Workspace2>
    );
  }

  return content;
}
