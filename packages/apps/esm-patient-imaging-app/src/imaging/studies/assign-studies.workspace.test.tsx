import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssignStudiesWorkspace from './assign-studies.workspace';
import * as api from '../../api';
import { CloseWorkspaceOptions, showSnackbar, useLayoutType } from '@openmrs/esm-framework';

jest.mock('@openmrs/esm-framework', () => ({
  useLayoutType: jest.fn(() => 'desktop'),
  launchWorkspace: jest.fn(),
  showSnackbar: jest.fn(),
  usePagination: jest.fn((items, pageSize) => ({
    results: items?.slice(0, pageSize) || [],
    goTo: jest.fn(),
    currentPage: 1,
  })),
  ErrorState: ({ error, headerTitle }: any) => (
    <div role="alert">
      {headerTitle}: {error?.message}
    </div>
  ),
  ExtensionSlot: ({ name }: any) => <div data-testid={`extension-slot-${name}`} />,
  ResponsiveWrapper: ({ children }: any) => <div data-testid="responsive-wrapper">{children}</div>,
  AddIcon: () => <span>AddIcon</span>,
}));

jest.mock('../../api');
jest.mock('../components/assign-studies-table.component', () => ({
  __esModule: true,
  default: ({ data }: any) => <div data-testid="assign-studies-table">Studies: {data?.studies?.length}</div>,
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  EmptyState: ({ displayText, headerTitle }: any) => (
    <div>
      {headerTitle}: {displayText}
    </div>
  ),
}));

let capturedAssignStudyFunction: ((study: any, isAssign: boolean) => Promise<void>) | undefined;

jest.mock('../components/assign-studies-table.component', () => (props: any) => {
  capturedAssignStudyFunction = props.assignStudyFunction;
  return <div data-testid="assign-studies-table" />;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

describe('AssignStudiesWorkspace', () => {
  const patientUuid = 'patientUID-123';
  const configuration = { id: 1, orthancBaseUrl: 'http://orthanc.local' };

  const mockStudyData = {
    id: 1,
    studyInstanceUID: 'studyUID1',
    orthancStudyUID: 'orthancUID1',
    mrsPatientUuid: patientUuid,
    orthancConfiguration: {
      id: 1,
      orthancBaseUrl: 'http://localhost:8042',
    },
    patientName: 'John Doe',
    studyDate: '2025-04-07',
    studyDescription: 'CT Chest without contrast',
    gender: 'Male',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLayoutType as jest.Mock).mockReturnValue('small-desktop');
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    (api.useStudiesByConfig as jest.Mock).mockReturnValue({
      data: { studies: [mockStudyData] },
      error: null,
      isLoading: false,
      isValidating: false,
    });
  });

  it('renders loading state when studies are loading', () => {
    (api.useStudiesByConfig as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isValidating: false,
    });

    render(
      <AssignStudiesWorkspace
        patientUuid={patientUuid}
        configuration={configuration}
        closeWorkspace={jest.fn()}
        patient={undefined}
        promptBeforeClosing={function (testFcn: () => boolean): void {
          throw new Error('Function not implemented.');
        }}
        closeWorkspaceWithSavedChanges={function (closeWorkspaceOptions?: CloseWorkspaceOptions): void {
          throw new Error('Function not implemented.');
        }}
        setTitle={function (title: string, titleNode?: React.ReactNode): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state when API returns error', () => {
    (api.useStudiesByConfig as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('API error'),
      isLoading: false,
      isValidating: false,
    });

    render(
      <AssignStudiesWorkspace
        patientUuid={patientUuid}
        configuration={configuration}
        closeWorkspace={jest.fn()}
        patient={null}
        promptBeforeClosing={function (testFcn: () => boolean): void {
          throw new Error('Function not implemented.');
        }}
        closeWorkspaceWithSavedChanges={function (closeWorkspaceOptions?: CloseWorkspaceOptions): void {
          throw new Error('Function not implemented.');
        }}
        setTitle={function (title: string, titleNode?: React.ReactNode): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByText(/API error/i)).toBeInTheDocument();
  });

  it('renders AssignStudiesTable when studies are available', () => {
    render(
      <AssignStudiesWorkspace
        patientUuid={patientUuid}
        configuration={configuration}
        closeWorkspace={jest.fn()}
        patient={null}
        promptBeforeClosing={() => true}
        closeWorkspaceWithSavedChanges={() => {}}
        setTitle={() => {}}
      />,
    );

    expect(screen.getByTestId('assign-studies-table')).toBeInTheDocument();
  });

  it('calls closeworkspace when close button is clicked', () => {
    const closeMock = jest.fn();

    render(
      <AssignStudiesWorkspace
        patientUuid={patientUuid}
        configuration={configuration}
        closeWorkspace={closeMock}
        patient={null}
        promptBeforeClosing={() => true}
        closeWorkspaceWithSavedChanges={() => {}}
        setTitle={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(closeMock).toHaveBeenCalled();
  });

  it('calls showSnackbar when assignStudyFunction succeeds', async () => {
    const mockMutate = jest.fn();
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({ mutate: mockMutate });
    (api.assignStudy as jest.Mock).mockResolvedValue({});

    render(
      <AssignStudiesWorkspace
        patientUuid={patientUuid}
        configuration={configuration}
        patient={null}
        promptBeforeClosing={() => true}
        closeWorkspaceWithSavedChanges={() => {}}
        setTitle={() => {}}
        closeWorkspace={jest.fn()}
      />,
    );

    await waitFor(() => expect(capturedAssignStudyFunction).toBeDefined());

    await capturedAssignStudyFunction(mockStudyData, true);

    expect(api.assignStudy).toHaveBeenCalledWith(mockStudyData.id, patientUuid, true, expect.any(AbortController));
    expect(mockMutate).toHaveBeenCalled();
    expect(showSnackbar).toHaveBeenCalledWith(expect.objectContaining({ kind: 'success' }));
  });
});
