import { ActionMenuButton, DocumentIcon, useWorkspaces, launchWorkspace2 } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { formEntryWorkspace, htmlFormEntryWorkspace } from '../../types';
import React, { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

interface CREDFormActionButtonProps {
  patientUuid: string;
}

const CREDFormActionButton: React.FC<CREDFormActionButtonProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { workspaces } = useWorkspaces();
  const launchCREDFormsWorkspace = useLaunchWorkspaceRequiringVisit(patientUuid, 'forms-selector-workspace');

  const formEntryWorkspaces = workspaces.filter((w) => w.name === formEntryWorkspace);
  const recentlyOpenedForm = formEntryWorkspaces[0];

  const htmlFormEntryWorkspaces = workspaces.filter((w) => w.name === htmlFormEntryWorkspace);
  const recentlyOpenedHtmlForm = htmlFormEntryWorkspaces[0];

  const isFormOpen = formEntryWorkspaces?.length >= 1;
  const isHtmlFormOpen = htmlFormEntryWorkspaces?.length >= 1;

  const launchWorkspaceCb = () => {
    if (isFormOpen) {
      launchWorkspace2(formEntryWorkspace, {
        workspaceTitle: recentlyOpenedForm?.additionalProps?.['workspaceTitle'],
      });
    }
    // We aren't currently supporting keeping HTML Form workspaces open, but just in case
    else if (isHtmlFormOpen) {
      launchWorkspace2(htmlFormEntryWorkspace, {
        workspaceTitle: recentlyOpenedHtmlForm?.additionalProps?.['workspaceTitle'],
      });
    } else {
      launchCREDFormsWorkspace();
    }
  };

  return (
    <ActionMenuButton
      getIcon={(props: ComponentProps<typeof DocumentIcon>) => <DocumentIcon {...props} />}
      label={t('credForms', 'Formularios CRED')}
      iconDescription={t('credForms', 'Formularios CRED')}
      handler={launchWorkspaceCb}
      type={'cred-form'}
    />
  );
};

export default CREDFormActionButton;
