import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StudiesDetailTable from './studies-details-table.component';
import { usePagination, showModal } from '@openmrs/esm-framework';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));
jest.mock('../../api');
jest.mock('@openmrs/esm-framework', () => ({
  showModal: jest.fn(),
  useLayoutType: jest.fn(() => 'desktop'),
  usePagination: jest.fn((items, pageSize) => ({
    results: items?.slice(0, pageSize) || [],
    goTo: jest.fn(),
    currentPage: 1,
  })),
  TrashCanIcon: (props: any) => <span data-testid="trash-icon" {...props} />,
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  PatientChartPagination: ({ pageNumber }: any) => <div data-testid="pagination">Page {pageNumber}</div>,
  EmptyState: ({ displayText, headerTitle }: any) => (
    <div>
      {headerTitle}: {displayText}
    </div>
  ),
  CardHeader: ({ children }: any) => <div>{children}</div>,
  compare: jest.fn((a, b) => (a > b ? 1 : a < b ? -1 : 0)),
}));

jest.mock('./series-details-table.component', () => (props: any) => {
  return <div data-testid="series-details">Series for {props.studyId}</div>;
});

describe('StudiesDetailsTable', () => {
  const mockStudies = [
    {
      id: 1,
      studyInstanceUID: 'STUDY-123',
      orthancStudyUID: 'ORTHANC-UID-123',
      mrsPatientUuid: 'patientUuid-123',
      patientName: 'John Doe',
      studyDate: '2025-08-29',
      studyDescription: 'Brain MRI',
      orthancConfiguration: { id: 1, orthancBaseUrl: 'http://localhost:8042' },
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (usePagination as jest.Mock).mockReturnValue({
      results: mockStudies,
      currentPage: 1,
      goTo: jest.fn(),
    });
  });

  it('renders EmptyState when no studies are available', () => {
    (usePagination as jest.Mock).mockReturnValue({
      results: [],
      currentPage: 1,
      goTo: jest.fn(),
    });

    render(<StudiesDetailTable patientUuid="patientUuid-123" studies={[]} />);

    expect(screen.getByText(/Studies: No studies found/i)).toBeInTheDocument();
  });

  it('renders table headers and study row', () => {
    render(<StudiesDetailTable patientUuid="patientUuid-123" studies={mockStudies} />);

    expect(screen.getByRole('table', { name: /Studies summary/i })).toBeInTheDocument();
    expect(screen.getByText(/STUDY-123/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-08-29/i)).toBeInTheDocument();
    expect(screen.getByText(/Brain MRI/i)).toBeInTheDocument();
  });

  it('shows pagination', () => {
    render(<StudiesDetailTable patientUuid="p-1" studies={mockStudies} />);
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1');
  });

  it('calls showModal when delete button clicked', () => {
    render(<StudiesDetailTable patientUuid="patientUuid-123" studies={mockStudies} showDeleteButton={true} />);
    fireEvent.click(screen.getByRole('button', { name: /Remove study/i }));
    expect(showModal).toHaveBeenCalled();
  });

  it('expand row and renders SeriesDetailsTable on double click', () => {
    render(<StudiesDetailTable patientUuid="patientUuid-123" studies={mockStudies} />);
    const row = screen.getByText(/Brain MRI/i);
    fireEvent.doubleClick(row);
    expect(screen.getByTestId('series-details')).toHaveTextContent('Series for 1');
  });

  it('navigates when viewer button clicked', () => {
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<StudiesDetailTable patientUuid="patientUuid-123" studies={mockStudies} />);

    fireEvent.click(screen.getByLabelText(/Stone viewer of Orthanc/i));
    expect(window.location.href).toContain('stone-webviewer');

    fireEvent.click(screen.getByLabelText(/Ohif viewer/i));
    expect(window.location.href).toContain('http://localhost:8042/ohif/viewer?StudyInstanceUIDs=STUDY-123');

    fireEvent.click(screen.getByLabelText(/Show data in orthanc explorer/i));
    expect(window.location.href).toContain('filtered-studies');
  });
});
