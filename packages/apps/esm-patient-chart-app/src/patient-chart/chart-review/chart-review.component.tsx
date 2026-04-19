import { type ConfigObject, useExtensionStore } from '@openmrs/esm-framework';
import { useNavGroups } from '@openmrs/esm-patient-common-lib';
import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { basePath } from '../../constants';

import { DashboardView, type DashboardConfig, type LayoutMode } from './dashboard-view.component';

function makePath(target: DashboardConfig, params: Record<string, string> = {}) {
  const parts = `${basePath}/${encodeURIComponent(target.path)}`.split('/');

  Object.keys(params).forEach((key) => {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i][0] === ':' && parts[i].indexOf(key) === 1) {
        parts[i] = params[key];
      }
    }
  });

  return parts.join('/');
}

function getDashboardDefinition(meta: object, config: ConfigObject, moduleName: string) {
  return { ...meta, ...config, moduleName };
}

interface ChartReviewProps {
  patientUuid: string;
  patient: fhir.Patient;
  view: string;
  setDashboardLayoutMode?: (layoutMode: LayoutMode) => void;
}

const ChartReview: React.FC<ChartReviewProps> = ({ patientUuid, patient, view, setDashboardLayoutMode }) => {
  const extensionStore = useExtensionStore();
  const { navGroups } = useNavGroups();

  const slotExists = 'patient-chart-dashboard-slot' in extensionStore.slots;

  const ungroupedDashboards = slotExists
    ? extensionStore.slots['patient-chart-dashboard-slot'].assignedExtensions.map((e) =>
        getDashboardDefinition(e.meta, e.config, e.moduleName),
      )
    : [];
  const groupedDashboards = navGroups.flatMap(
    (slotName) =>
      extensionStore.slots[slotName]?.assignedExtensions.map((e) =>
        getDashboardDefinition(e.meta, e.config, e.moduleName),
      ) ?? [],
  );
  const dashboards = ungroupedDashboards.concat(groupedDashboards) as Array<DashboardConfig>;

  const defaultDashboard = dashboards.filter((dashboard) => dashboard.path)[0];
  const dashboard = useMemo(() => {
    return view ? dashboards.find((dashboard) => dashboard.path === view) : undefined;
  }, [dashboards, view]);

  useEffect(() => {
    const activeDashboard = dashboard ?? defaultDashboard;
    if (setDashboardLayoutMode && activeDashboard) {
      setDashboardLayoutMode(activeDashboard.layoutMode ?? 'contained');
    }
  }, [dashboard, defaultDashboard, setDashboardLayoutMode]);

  if (!slotExists) {
    return null;
  }

  if (!defaultDashboard) {
    return null;
  } else if (!dashboard) {
    return (
      <Navigate
        to={makePath(defaultDashboard, {
          patientUuid,
        })}
        replace
      />
    );
  } else {
    return <DashboardView dashboard={dashboard} patientUuid={patientUuid} patient={patient} />;
  }
};

export default ChartReview;
