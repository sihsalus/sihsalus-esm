import { ExtensionSlot } from '@openmrs/esm-framework';
import React from 'react';
import { GroupFormWorkflowProvider } from '../context/GroupFormWorkflowContext';
import GroupSessionWorkspace from './GroupSessionWorkspace';
import GroupDisplayHeader from './group-display-header';
import GroupSearchHeader from './group-search-header';
import SessionMetaWorkspace from './SessionMetaWorkspace';
import styles from './styles.scss';

const GroupFormEntryWorkflow = () => {
  return (
    <GroupFormWorkflowProvider>
      <div className={styles.breadcrumbsContainer}>
        <ExtensionSlot name="breadcrumbs-slot" />
      </div>
      <GroupSearchHeader />
      <GroupDisplayHeader />
      <div className={styles.workspaceWrapper}>
        <SessionMetaWorkspace />
        <GroupSessionWorkspace />
      </div>
    </GroupFormWorkflowProvider>
  );
};

export default GroupFormEntryWorkflow;
