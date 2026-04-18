import {
  getRegisteredWorkspace2Names,
  launchWorkspace,
  launchWorkspace2,
  navigate,
  navigateAndLaunchWorkspace,
  showModal,
  useFeatureFlag,
  type DefaultWorkspaceProps,
  type Visit,
  type Workspace2DefinitionProps,
} from '@openmrs/esm-framework';
import { useCallback } from 'react';

import { launchStartVisitPrompt } from './launchStartVisitPrompt';
import { useVisitOrOfflineVisit } from './offline/visit';
import { getPatientUuidFromStore, usePatientChartStore } from './store/patient-chart-store';
import { useSystemVisitSetting } from './useSystemVisitSetting';

export interface DefaultPatientWorkspaceProps extends DefaultWorkspaceProps {
  patientUuid: string;
}

export interface PatientWorkspaceGroupProps {
  patient: fhir.Patient | null;
  patientUuid: string;
  visitContext: Visit | null;
  mutateVisitContext: (() => void) | null;
}

export interface PatientChartWorkspaceActionButtonProps {
  groupProps: PatientWorkspaceGroupProps;
}

export type PatientWorkspace2DefinitionProps<
  WorkspaceProps extends object,
  WindowProps extends object,
> = Workspace2DefinitionProps<WorkspaceProps, WindowProps, PatientWorkspaceGroupProps>;

function isWorkspace2Registered(workspaceName: string): boolean {
  return getRegisteredWorkspace2Names().includes(workspaceName);
}

function getPatientWorkspaceGroupProps(): PatientWorkspaceGroupProps | null {
  const patientUuid = getPatientUuidFromStore();

  if (!patientUuid) {
    return null;
  }

  return {
    patient: null,
    patientUuid,
    visitContext: null,
    mutateVisitContext: null,
  };
}

export function launchPatientWorkspace(workspaceName: string, additionalProps?: object): void {
  const patientUuid = getPatientUuidFromStore();

  if (isWorkspace2Registered(workspaceName)) {
    void launchWorkspace2(workspaceName, additionalProps ?? null, null, getPatientWorkspaceGroupProps());
    return;
  }

  launchWorkspace(workspaceName, {
    patientUuid,
    ...additionalProps,
  });
}

export function launchPatientChartWithWorkspaceOpen({
  patientUuid,
  workspaceName,
  dashboardName,
  additionalProps,
}: {
  patientUuid: string;
  workspaceName: string;
  dashboardName?: string;
  additionalProps?: object;
}): void {
  // Keep legacy workspace launching for callers that still target the v9-style
  // workspace contract while exposing Workspace2 helpers alongside it.
  navigateAndLaunchWorkspace({
    targetUrl: '${openmrsSpaBase}/patient/' + `${patientUuid}/chart` + (dashboardName ? `/${dashboardName}` : ''),
    workspaceName,
    contextKey: `patient/${patientUuid}`,
    additionalProps,
  });
}

export function useStartVisitIfNeeded(patientUuid?: string): () => Promise<boolean> {
  const store = usePatientChartStore(patientUuid);
  const { systemVisitEnabled } = useSystemVisitSetting();
  const isRdeEnabled = useFeatureFlag('rde');

  const startVisitIfNeeded = useCallback(async (): Promise<boolean> => {
    if (!systemVisitEnabled || store.visitContext) {
      return true;
    }

    if (!patientUuid) {
      launchStartVisitPrompt();
      return false;
    }

    return new Promise<boolean>((resolve) => {
      if (isRdeEnabled) {
        const dispose = showModal('visit-context-switcher', {
          patientUuid,
          closeModal: () => {
            dispose();
            resolve(false);
          },
          onAfterVisitSelected: () => {
            dispose();
            resolve(true);
          },
          size: 'sm',
        });
      } else {
        const dispose = showModal('start-visit-dialog', {
          closeModal: () => {
            dispose();
            resolve(false);
          },
          onVisitStarted: () => {
            dispose();
            resolve(true);
          },
        });
      }
    });
  }, [isRdeEnabled, patientUuid, store.visitContext, systemVisitEnabled]);

  return startVisitIfNeeded;
}

export function useLaunchWorkspaceRequiringVisit<T extends object>(
  patientUuid: string,
  workspaceName: string,
): (workspaceProps?: T, windowProps?: object, groupProps?: object) => void;
export function useLaunchWorkspaceRequiringVisit<T extends object>(
  workspaceName: string,
): (additionalProps?: T) => void;
export function useLaunchWorkspaceRequiringVisit<T extends object>(
  patientUuidOrWorkspaceName: string,
  maybeWorkspaceName?: string,
): (workspaceProps?: T, windowProps?: object, groupProps?: object) => void {
  const workspaceName = maybeWorkspaceName ?? patientUuidOrWorkspaceName;
  const patientUuid = maybeWorkspaceName ? patientUuidOrWorkspaceName : undefined;
  const { patientUuid: storedPatientUuid } = usePatientChartStore(patientUuid);
  const { systemVisitEnabled } = useSystemVisitSetting();
  const { currentVisit } = useVisitOrOfflineVisit(patientUuid ?? storedPatientUuid);
  const startVisitIfNeeded = useStartVisitIfNeeded(patientUuid);

  return useCallback(
    (workspaceProps?: T, windowProps?: object, groupProps?: object): void => {
      if (patientUuid) {
        const patientChartGroupProps = groupProps ?? getPatientWorkspaceGroupProps();
        void startVisitIfNeeded().then((didStartVisit) => {
          if (didStartVisit) {
            void launchWorkspace2(workspaceName, workspaceProps ?? null, windowProps ?? null, patientChartGroupProps);
          }
        });
        return;
      }

      if (!systemVisitEnabled || currentVisit) {
        launchPatientWorkspace(workspaceName, workspaceProps);
      } else {
        launchStartVisitPrompt();
      }
    },
    [currentVisit, patientUuid, startVisitIfNeeded, systemVisitEnabled, workspaceName],
  );
}

export function launchPatientChartWithWorkspaceOpen2({
  patientUuid,
  workspaceName,
  dashboardName,
  additionalProps,
}: {
  patientUuid: string;
  workspaceName: string;
  dashboardName?: string;
  additionalProps?: object;
}): void {
  void launchWorkspace2(workspaceName, additionalProps);
  navigate({ to: '${openmrsSpaBase}/patient/' + `${patientUuid}/chart` + (dashboardName ? `/${dashboardName}` : '') });
}
