import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ProcedureStepTable, { ProcedureStepTableProps } from './procedureStep-details-table.component';
import * as api from '../../api';

jest.mock('../../api');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('@openmrs/esm-framework', () => ({
  useLayoutType: () => 'desktop',
  usePagination: (data: any[], pageSize: number) => ({
    results: data.slice(0, pageSize),
    goTo: jest.fn(),
    currentPage: 1,
  }),
  TrashCanIcon: (props: any) => <span data-testid="trash-icon" {...props} />,
  showModal: jest.fn(() => jest.fn()),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  compare: jest.fn((a, b) => (a > b ? 1 : a < b ? -1 : 0)),
  PatientChartPagination: ({ pageNumber, totalItems }: any) => (
    <div data-testid="pagination">
      Page {pageNumber} of {totalItems}
    </div>
  ),
  EmptyState: ({ displayText }: any) => <div data-testid="empty-state">{displayText}</div>,
}));

describe('ProcedureStepTable', () => {
  const orignalError = console.error;

  const defaultProps: ProcedureStepTableProps = {
    requestProcedure: { id: 1, description: 'Test procedure' } as any,
  };

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
      if (typeof msg === 'string' && (msg.includes('ResizeObserver') || msg.includes('act(...)'))) {
        return;
      }
      orignalError(msg, ...args);
    });
  });

  afterAll(() => {
    console.error = orignalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    (api.useProcedureStep as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: true,
      isValidating: false,
    });
    await act(async () => {
      render(<ProcedureStepTable {...defaultProps} />);
    });

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    (api.useProcedureStep as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isValidating: false,
    });
    await act(async () => {
      render(<ProcedureStepTable {...defaultProps} />);
    });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders table rows with pagination', async () => {
    (api.useProcedureStep as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          performedProcedureStepStatus: 'complete',
          modality: 'CT',
          aetTitle: 'AET1',
          scheduledReferringPhysician: 'Dr. Smith',
          requestedProcedureDescription: 'Description 1',
          stepStartDate: '2023-01-01',
          stepStartTime: '10:00',
          stationName: 'Station 1',
          procedureStepLocation: 'Room1',
        },
        {
          id: 2,
          performedProcedureStepStatus: 'scheduled',
          modality: 'MR',
          aetTitle: 'AET2',
          scheduledReferringPhysician: 'Dr. Jane',
          requestedProcedureDescription: 'Description 2',
          stepStartDate: '2023-01-02',
          stepStartTime: '11:00',
          stationName: 'Station 2',
          procedureStepLocation: 'Room2',
        },
      ],
      error: null,
      isLoading: false,
      isValidating: false,
    });

    await act(async () => {
      render(<ProcedureStepTable {...defaultProps} />);
    });

    // Table header
    expect(screen.getByText('StepID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Tabler rows
    expect(screen.getByText('CT')).toBeInTheDocument();
    expect(screen.getByText('MR')).toBeInTheDocument();
    expect(screen.getByText('AET1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('triggers delete modal when TrashCanIcon clicked', async () => {
    const mockShowModal = jest.fn(() => jest.fn());
    (api.useProcedureStep as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          performedProcedureStepStatus: 'complete',
          modality: 'CT',
          aetTitle: 'AET1',
          scheduledReferringPhysician: 'Dr. Smith',
          requestedProcedureDescription: 'Description 1',
          stepStartDate: '2023-01-01',
          stepStartTime: '10:00',
          stationName: 'Station 1',
          procedureStepLocation: 'Room1',
        },
      ],
      error: null,
      isLoading: false,
      isValidating: false,
    });

    (require('@openmrs/esm-framework').showModal as jest.Mock) = mockShowModal;

    await act(async () => {
      render(<ProcedureStepTable {...defaultProps} />);
    });

    const button = screen.getByLabelText('Remove step');
    fireEvent.click(button);

    expect(mockShowModal).toHaveBeenCalled();
  });
});
