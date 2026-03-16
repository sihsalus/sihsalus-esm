import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import RequestProcedureTable from './requests-details-table.component';
import { usePagination } from '@openmrs/esm-framework';
import * as framework from '@openmrs/esm-framework';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('@openmrs/esm-framework', () => ({
  showModal: jest.fn(),
  launchWorkspace: jest.fn(),
  useLayoutType: jest.fn(() => 'desktop'),
  createGlobalStore: jest.fn(() => ({
    getState: jest.fn(),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  })),
  usePagination: jest.fn((items, pageSize) => ({
    results: items?.slice(0, pageSize) || [],
    goto: jest.fn(),
    currentPage: 1,
  })),
  AddIcon: (props: any) => <span {...props}>AddIcon</span>,
  TrashCanIcon: (props: any) => <span {...props}>TrashCanIcon</span>,
  select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
  SelectItem: ({ text, value }: any) => <option value={value}>{text}</option>,
}));

// Mock other OpenMRS libs
jest.mock('@openmrs/esm-patient-common-lib', () => ({
  CardHeader: ({ children }: any) => <div>{children}</div>,
  compare: jest.fn((a, b) => (a > b ? 1 : -1)),
  PatientChartPagination: ({ pageNumber }: any) => <div>Page {pageNumber}</div>,
  EmptyState: ({ displayText, headerTitle }: any) => (
    <div>
      {headerTitle}: {displayText}
    </div>
  ),
  useLaunchWorkspaceRequiringVisit: (workspace: any) => jest.fn(),
}));

describe('RequestProcedureTable', () => {
  const patientUuid = 'patient-12345';

  const mockRequests = [
    {
      id: 1,
      status: 'scheduled',
      priority: 'high',
      requestingPhysician: 'Dr. Who',
      studyInstanceUID: 'UID123',
      requestDescription: 'MRI scan',
      orthancConfiguration: { id: 1, orthancBaseUrl: 'http://orthanc.local' },
      patientUuid: patientUuid,
      accessionNumber: 'ACC123',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (usePagination as jest.Mock).mockReturnValue({
      results: mockRequests,
      currentPage: 1,
      goTo: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Empty State when no requests are available', async () => {
    await act(async () => {
      render(<RequestProcedureTable requests={[]} patientUuid={patientUuid} />);
    });
    expect(screen.getByText(/No requests found/i)).toBeInTheDocument();
  });

  it('renders table rows when requests are provided', async () => {
    await act(async () => {
      render(<RequestProcedureTable requests={mockRequests} patientUuid={patientUuid} />);
    });
    const table = screen.getByRole('table');
    expect(screen.getByText(/MRI scan/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Who/i)).toBeInTheDocument();
    expect(within(table).getByText(/scheduled/i)).toBeInTheDocument();
  });

  it('call showModal when delete icon is clicked', async () => {
    const mockDispose = jest.fn();
    (framework.showModal as jest.Mock).mockReturnValue(mockDispose);

    await act(async () => {
      render(<RequestProcedureTable requests={mockRequests} patientUuid={patientUuid} />);
    });

    const deleteButton = screen.getByLabelText(/Remove requst/i);
    fireEvent.click(deleteButton);

    expect(framework.showModal).toHaveBeenCalled();
  });

  it('renders ProcedureStepTable when a row is expanded', async () => {
    await act(async () => {
      render(<RequestProcedureTable requests={mockRequests} patientUuid={patientUuid} />);
    });

    const row = screen.getByText(/MRI scan/i).closest('tr');
    expect(row).toBeInTheDocument();

    fireEvent.doubleClick(row!);

    await waitFor(() => {
      expect(screen.getByLabelText(/procedureStep/i)).toBeInTheDocument();
    });
  });

  test('status and priority filters default to "all" and update on change', async () => {
    await act(async () => {
      render(<RequestProcedureTable requests={mockRequests} patientUuid={patientUuid} />);
    });

    // Get the select elements
    const statusSelect = screen.getByLabelText(/status-filter/i);
    const prioritySelect = screen.getByLabelText(/priority-filter/i);

    // Check default value
    expect(statusSelect).toHaveValue('all');
    expect(prioritySelect).toHaveValue('all');

    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    expect(statusSelect).toHaveValue('completed');

    // Change priority filter
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    expect(prioritySelect).toHaveValue('high');
  });
});
