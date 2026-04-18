import {
  ExtensionSlot,
  WorkspaceContainer,
  setCurrentVisit,
  setLeftNav,
  unsetLeftNav,
  usePatient,
  useVisit,
  useWorkspaces,
} from '@openmrs/esm-framework';
import { getPatientChartStore } from '@openmrs/esm-patient-common-lib';
import * as Styleguide from '@openmrs/esm-styleguide';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { spaBasePath } from '../constants';
import Loader from '../loader/loader.component';
import ChartReview from '../patient-chart/chart-review/chart-review.component';
import SideMenuPanel from '../side-nav/side-menu.component';
import VisitHeader from '../visit-header/visit-header.component';

import { type LayoutMode } from './chart-review/dashboard-view.component';
import styles from './patient-chart.scss';

const WorkspaceWindowsAndMenu =
  'WorkspaceWindowsAndMenu' in Styleguide
    ? (Styleguide.WorkspaceWindowsAndMenu as React.ComponentType<{ showActionMenu?: boolean }>)
    : null;

const PatientChart: React.FC = () => {
  const { patientUuid, view: encodedView } = useParams();
  const view = encodedView ? decodeURIComponent(encodedView) : undefined;
  const { isLoading: isLoadingPatient, patient } = usePatient(patientUuid);
  const { currentVisit, mutate: mutateVisitContext } = useVisit(patientUuid);
  const state = useMemo(() => ({ patient, patientUuid }), [patient, patientUuid]);
  const { workspaceWindowState, active } = useWorkspaces();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>();
  const hasVisibleLegacyWorkspace = workspaceWindowState === 'normal' && active;

  // We are responsible for creating a new offline visit while in offline mode.
  // The patient chart widgets assume that this is handled by the chart itself.
  // We are also the module that holds the offline visit type UUID config.
  // The following hook takes care of the creation.

  // Keep state updated with the current patient. Anything used outside the patient
  // chart (e.g., the current visit is used by the Active Visit Tag used in the
  // patient search) must be updated in the callback, which is called when the patient
  // chart unmounts.
  useEffect(() => {
    return () => {
      setCurrentVisit(null, null);
    };
  }, [patientUuid]);

  useEffect(() => {
    getPatientChartStore().setState({
      patientUuid: patientUuid ?? null,
      patient,
      visitContext: currentVisit ?? null,
      mutateVisitContext,
    });
    return () => {
      getPatientChartStore().setState({
        patientUuid: null,
        patient: null,
        visitContext: null,
        mutateVisitContext: null,
      });
    };
  }, [currentVisit, mutateVisitContext, patient, patientUuid]);

  const leftNavBasePath = useMemo(() => spaBasePath.replace(':patientUuid', patientUuid), [patientUuid]);
  useEffect(() => {
    setLeftNav({ name: 'patient-chart-dashboard-slot', basePath: leftNavBasePath });
    return () => unsetLeftNav('patient-chart-dashboard-slot');
  }, [leftNavBasePath]);

  return (
    <>
      <VisitHeader patient={patient} />
      <SideMenuPanel />
      <main className={classNames('omrs-main-content', styles.chartContainer)}>
        <>
          <div
            className={classNames(
              styles.innerChartContainer,
              hasVisibleLegacyWorkspace ? styles.closeWorkspace : styles.activeWorkspace,
            )}
          >
            {isLoadingPatient ? (
              <Loader />
            ) : (
              <>
                <aside>
                  <ExtensionSlot name="patient-header-slot" state={state} />
                  <ExtensionSlot name="patient-highlights-bar-slot" state={state} />
                  <ExtensionSlot name="patient-info-slot" state={state} />
                </aside>
                <div className={styles.grid}>
                  <div
                    className={classNames(styles.chartReview, { [styles.widthContained]: layoutMode == 'contained' })}
                  >
                    <ChartReview {...state} view={view} setDashboardLayoutMode={setLayoutMode} />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      </main>
      <WorkspaceContainer showSiderailAndBottomNav contextKey={`patient/${patientUuid}`} />
      {WorkspaceWindowsAndMenu ? <WorkspaceWindowsAndMenu showActionMenu={false} /> : null}
    </>
  );
};

export default PatientChart;
