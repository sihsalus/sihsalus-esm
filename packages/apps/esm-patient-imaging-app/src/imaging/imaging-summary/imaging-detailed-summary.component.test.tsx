import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImagingDetailedSummary from './imaging-detailed-summary.component';
import * as api from '../../api';
import { launchWorkspace } from '@openmrs/esm-framework';

jest.mock('@openmrs/esm-framework', () => ({
  useLayoutType: jest.fn(() => 'desktop'),
  launchWorkspace: jest.fn(),
  usePagination: jest.fn((items, pageSize) => ({
    results: items?.slice(0, pageSize) || [],
    goTo: jest.fn(),
    currentPage: 1,
  })),
  AddIcon: () => <span>AddIcon</span>,
}));

jest.mock('../components/studies-details-table.component', () => () => <div>StudiesDetailTable</div>);
jest.mock('../components/requests-details-table.component', () => () => <div>RequestProcedureTable</div>);

jest.mock('../../api');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  CardHeader: ({ children, title }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  EmptyState: ({ displayText, headerTitle, launchForm }: any) => (
    <div data-testid="empty-state">
      {headerTitle}: {displayText}
      {launchForm && <button onClick={launchForm}>Launch</button>}
    </div>
  ),
  ErrorState: ({ error, headerTitle }: any) => (
    <div data-testid="error-state">
      {headerTitle}: {error?.message || 'Error'}
    </div>
  ),
}));

describe('<ImagingDetailedSummary />', () => {
  const patientUuid = 'patient-uuid-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeletons when data is loading', () => {
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
  });

  it('renders empty state when no studies or requests exist', () => {
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    expect(screen.getByText(/Studies: No studies found/i)).toBeInTheDocument();
    expect(screen.getByText(/Worklist: No worklist found/i)).toBeInTheDocument();
  });

  it('renders error states if API returns errors', () => {
    const error = new Error('Failed to fetch');

    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    expect(screen.getAllByTestId('error-state')).toHaveLength(2);
    expect(screen.getAllByText(/Worklist: Failed to fetch/i)).toHaveLength(1);
  });

  it('renders error states if studies error', () => {
    const error = new Error('Failed to fetch');

    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    expect(screen.getAllByTestId('error-state')).toHaveLength(1);
    expect(screen.getAllByText(/Studies: Failed to fetch/i)).toHaveLength(1);
  });

  it('renders RequestProcedureTable when requests exist', () => {
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          studyInstanceUID: 'STUDY-123',
          requestDescription: 'Request 1',
          orthancConfiguration: { orthancBaseUrl: 'http://orthanc.local' },
          patientName: 'John Doe',
          studyDate: '2025-08-29',
        },
      ],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    expect(screen.getByText('RequestProcedureTable')).toBeInTheDocument();
  });

  it('triggers workspace launches when buttons clicked', () => {
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          studyInstanceUID: 'STUDY-123',
          requestDescription: 'Request1',
          orthancConfiguration: { orthancBaseUrl: 'http://orthanc.local' },
          patientName: 'John Doe',
          studyDate: '2025-08-29',
        },
      ],
      isLoading: false,
      error: null,
      isValidating: false,
    });

    render(<ImagingDetailedSummary patientUuid={patientUuid} />);

    const linkButton = screen.getByText(/Link studies/i);
    fireEvent.click(linkButton);

    const uploadButton = screen.getByText(/Upload/i);
    fireEvent.click(uploadButton);

    expect(launchWorkspace).toHaveBeenCalledTimes(2);
  });
});
