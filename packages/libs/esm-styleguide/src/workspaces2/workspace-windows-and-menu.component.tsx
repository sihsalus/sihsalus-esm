import React, { useEffect } from 'react';
import { type WorkspaceGroupDefinition2, type WorkspaceWindowDefinition2 } from '@openmrs/esm-globals';
import { subscribeOpenmrsEvent } from '@openmrs/esm-emr-api';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';
import { ActionMenu } from './action-menu2/action-menu2.component';
import { closeWorkspaceGroup2, useWorkspace2Store } from './workspace2';
import { shouldCloseOnUrlChange } from './scope-utils';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import styles from './workspace-windows-and-menu.module.scss';

export function renderWorkspaceWindowsAndMenu(target: HTMLElement | null): void {
  if (target) {
    const root = createRoot(target);
    root.render(<WorkspaceWindowsAndMenu />);
  }
}

/**
 * This component renders the workspace action menu of a workspace group
 * and all the active workspace windows within that group.
 */
interface WorkspaceWindowsAndMenuProps {
  showActionMenu?: boolean;
}

export function WorkspaceWindowsAndMenu({
  showActionMenu = true,
}: WorkspaceWindowsAndMenuProps): React.JSX.Element | null {
  const { openedGroup, openedWindows, registeredGroupsByName, registeredWindowsByName } = useWorkspace2Store();
  const registeredGroups = registeredGroupsByName as Record<string, WorkspaceGroupDefinition2 & { moduleName: string }>;
  const registeredWindows = registeredWindowsByName as Record<string, WorkspaceWindowDefinition2>;
  const workspaceStyles = styles as Record<string, string>;

  useEffect(() => {
    const subscription: unknown = subscribeOpenmrsEvent('before-page-changed', (pageChangedEvent) => {
      const { newPage, oldUrl, newUrl } = pageChangedEvent;

      if (!openedGroup) {
        return;
      }

      // Always close on app change - this takes precedence as a safety boundary
      if (newPage) {
        pageChangedEvent.cancelNavigation(closeWorkspaceGroup2().then((isClosed) => !isClosed));
        return;
      }

      const group = registeredGroups[openedGroup.groupName];
      const scopePattern = group?.scopePattern;

      // No scopePattern means no additional scope-based closing (original behavior)
      if (!scopePattern) {
        return;
      }

      if (process.env.NODE_ENV !== 'production' && !scopePattern.startsWith('^')) {
        console.warn(
          `Workspace group "${openedGroup.groupName}" has a scopePattern without a start anchor (^). ` +
            `This may cause unexpected behavior. Pattern: "${scopePattern}"`,
        );
      }

      if (shouldCloseOnUrlChange(scopePattern, oldUrl, newUrl)) {
        // Prompt to close the workspaces
        // should only cancel navigation if the user cancels the prompt
        pageChangedEvent.cancelNavigation(closeWorkspaceGroup2().then((isClosed) => !isClosed));
      }
    });

    const unsubscribe = typeof subscription === 'function' ? (subscription as () => void) : null;

    return (): void => {
      unsubscribe?.();
    };
  }, [openedGroup, registeredGroups]);

  if (!openedGroup) {
    return null;
  }

  const group = registeredGroups[openedGroup.groupName];
  if (!group) {
    throw new Error(`Cannot find registered workspace group ${openedGroup.groupName}`);
  }

  const hasMaximizedWindow = openedWindows.some((window) => window.maximized);

  const { name: groupName } = group;
  const windowsWithIcons = Object.values(registeredWindows)
    .filter((window): window is Required<typeof window> => window.group === groupName && window.icon !== undefined)
    .sort((a, b) => (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE));
  const shouldShowActionMenu = showActionMenu && windowsWithIcons.length > 0;

  return (
    <div
      className={classNames(workspaceStyles.workspaceWindowsAndMenuContainer, {
        [workspaceStyles.overlay as string]: group.overlay,
        [workspaceStyles.hasMaximizedWindow as string]: hasMaximizedWindow,
      })}
    >
      <div className={workspaceStyles.workspaceWindowsContainer}>
        {openedWindows.map((openedWindow) => {
          return (
            <ActiveWorkspaceWindow
              key={openedWindow.windowName}
              openedWindow={openedWindow}
              showActionMenu={shouldShowActionMenu}
            />
          );
        })}
      </div>
      {shouldShowActionMenu && <ActionMenu workspaceGroup={group} groupProps={openedGroup.props} />}
    </div>
  );
}
