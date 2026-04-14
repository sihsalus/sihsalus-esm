import { useConfig, useSession } from '@openmrs/esm-framework';
import { screen, waitFor } from '@testing-library/react';
import { renderWithSwr } from 'test-utils';
import { mockSession } from 'test-utils';
import React from 'react';

import OverviewComponent from './overview.component';
import { useReports } from './reports.resource';

const mockReports = [
  {
    id: 'report-1',
    reportName: 'OPD/IPD Report',
    status: 'Failed',
    requestedBy: 'RUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI',
    requestedByUserUuid: mockSession.data.user.uuid,
    requestedOn: '2025-11-12 12:00',
    outputFormat: 'CsvReportRenderer',
    parameters: 'startDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric Service',
    evaluateCompleteDatetime: '',
    schedule: '',
  },
  {
    id: 'report-2',
    reportName: 'OPD/IPD Report',
    status: 'Failed',
    requestedBy: 'RUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI',
    requestedByUserUuid: mockSession.data.user.uuid,
    requestedOn: '2025-11-11 12:00',
    outputFormat: 'CsvReportRenderer',
    parameters: 'startDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric Service',
    evaluateCompleteDatetime: '',
    schedule: '',
  },
  {
    id: 'report-3',
    reportName: 'OPD/IPD Report',
    status: 'Failed',
    requestedBy: 'RUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI',
    requestedByUserUuid: mockSession.data.user.uuid,
    requestedOn: '2025-11-10 12:00',
    outputFormat: 'CsvReportRenderer',
    parameters: 'startDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric Service',
    evaluateCompleteDatetime: '',
    schedule: '',
  },
  {
    id: 'report-4',
    reportName: 'Generic Encounter Report',
    status: 'Completed',
    requestedBy: 'Admin User',
    requestedByUserUuid: mockSession.data.user.uuid,
    requestedOn: '2025-11-13 10:30',
    outputFormat: 'Web Preview',
    parameters: 'startDate: 2025-11-01, endDate: 2025-11-13, location: Main Clinic',
    evaluateCompleteDatetime: '',
    schedule: '',
  },
  {
    id: 'report-5',
    reportName: 'Patient Demographics Report',
    status: 'Completed',
    requestedBy: 'System Administrator',
    requestedByUserUuid: mockSession.data.user.uuid,
    requestedOn: '2025-11-13 09:15',
    outputFormat: 'Generic Encounter Report.xls',
    parameters: 'location: All Locations, ageGroup: Adult',
    evaluateCompleteDatetime: '',
    schedule: '',
  },
];

// Mock dependencies
jest.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: jest.fn(),
  useConfig: jest.fn(),
  useSession: jest.fn(),
  useLayoutType: jest.fn(() => 'desktop'),
  isDesktop: jest.fn(() => true),
  userHasAccess: jest.fn(() => true),
  ExtensionSlot: jest.fn(({ name }) => <div data-testid={`extension-slot-${name}`} />),
  navigate: jest.fn(),
  showModal: jest.fn(),
  getGlobalStore: jest.fn(() => ({
    getState: jest.fn(),
    setState: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

const mockUseReports = jest.mocked(useReports);

jest.mock('./reports.resource', () => ({
  useReports: jest.fn(),
  downloadReport: jest.fn(),
  downloadMultipleReports: jest.fn(),
  preserveReport: jest.fn(),
}));

const mockUseSession = jest.mocked(useSession);

const mockUseConfig = useConfig as jest.Mock;

describe('OverviewComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue(mockSession.data);
  });

  it('should show View button for Web Preview reports', async () => {
    mockUseConfig.mockReturnValue({
      webPreviewViewReportUrl: 'https://example.com/view/{reportRequestUuid}',
    });

    mockUseReports.mockReturnValue({
      reports: mockReports,
      reportsTotalCount: mockReports.length,
      error: null,
      isValidating: false,
      mutateReports: jest.fn(),
    });

    renderWithSwr(<OverviewComponent />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    const expectedColumnHeaders = [
      /report name/i,
      /status/i,
      /requested by/i,
      /requested on/i,
      /output format/i,
      /actions/i,
    ];

    expectedColumnHeaders.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(header, 'i') })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.getAllByRole('button', { name: /^Delete$/i })).toHaveLength(5);
  });

  it('should show Download button when webPreviewViewReportUrl is NOT configured', async () => {
    mockUseConfig.mockReturnValue({
      webPreviewViewReportUrl: '', // No URL configured
    });

    mockUseReports.mockReturnValue({
      reports: mockReports,
      reportsTotalCount: mockReports.length,
      error: null,
      isValidating: false,
      mutateReports: jest.fn(),
    });

    renderWithSwr(<OverviewComponent />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    // Validate table headers
    const expectedColumnHeaders = [
      /report name/i,
      /status/i,
      /requested by/i,
      /requested on/i,
      /output format/i,
      /actions/i,
    ];

    expectedColumnHeaders.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(header, 'i') })).toBeInTheDocument();
    });

    // Validate row contents - when webPreviewViewReportUrl is NOT configured:
    // - Failed reports should show Delete button only
    // - Completed reports should show Download button instead of View button
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.getAllByRole('button', { name: /^Delete$/i })).toHaveLength(5);
  });
});
