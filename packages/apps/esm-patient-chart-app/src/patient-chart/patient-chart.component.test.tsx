import { render, waitFor } from '@testing-library/react';
import React from 'react';

import PatientChart from './patient-chart.component';

const mockLaunchWorkspaceGroup2 = jest.fn();
const mockSetCurrentVisit = jest.fn();
const mockSetLeftNav = jest.fn();
const mockUnsetLeftNav = jest.fn();
const mockStoreSetState = jest.fn();
const mockMutateVisitContext = jest.fn();
const mockCurrentVisit = {
  uuid: 'active-visit-uuid',
} as const;

jest.mock('@openmrs/esm-framework', () => ({
  ExtensionSlot: () => null,
  WorkspaceContainer: () => null,
  launchWorkspaceGroup2: (...args: Array<unknown>) => mockLaunchWorkspaceGroup2(...args),
  setCurrentVisit: (...args: Array<unknown>) => mockSetCurrentVisit(...args),
  setLeftNav: (...args: Array<unknown>) => mockSetLeftNav(...args),
  unsetLeftNav: (...args: Array<unknown>) => mockUnsetLeftNav(...args),
  usePatient: () => ({
    isLoading: false,
    patient: {
      id: 'patient-uuid',
    },
  }),
  useWorkspaces: () => ({
    workspaceWindowState: 'hidden',
    active: false,
  }),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  getPatientChartStore: () => ({
    setState: mockStoreSetState,
  }),
  useVisitOrOfflineVisit: () => ({
    currentVisit: mockCurrentVisit,
    mutate: mockMutateVisitContext,
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    patientUuid: 'patient-uuid',
    view: undefined,
  }),
}));

jest.mock('../loader/loader.component', () => () => <div>Loading</div>);
jest.mock('../patient-chart/chart-review/chart-review.component', () => () => <div>Chart review</div>);
jest.mock('../side-nav/side-menu.component', () => () => <div>Side menu</div>);
jest.mock('../visit-header/visit-header.component', () => () => <div>Visit header</div>);

describe('PatientChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('launches the patient-chart workspace group with the active visit context', async () => {
    render(<PatientChart />);

    await waitFor(() => {
      expect(mockLaunchWorkspaceGroup2).toHaveBeenCalledWith(
        'patient-chart',
        expect.objectContaining({
          patientUuid: 'patient-uuid',
          visitContext: mockCurrentVisit,
          mutateVisitContext: mockMutateVisitContext,
        }),
      );
    });

    expect(mockStoreSetState).toHaveBeenCalledWith(
      expect.objectContaining({
        patientUuid: 'patient-uuid',
        visitContext: mockCurrentVisit,
        mutateVisitContext: mockMutateVisitContext,
      }),
    );
  });
});
