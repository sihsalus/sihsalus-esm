import { mockReports, mockSession } from '@mocks/index';
import { useConfig, useSession } from '@openmrs/esm-framework';
import { screen, waitFor } from '@testing-library/react';
import { renderWithSwr } from '@tools/test-helpers';
import React from 'react';

import OverviewComponent from './overview.component';
import { useReports } from './reports.resource';

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

    const allRows = screen.getAllByRole('row');
    expect(allRows.length).toBe(6);
    const rowTexts = allRows.map((row) => row.textContent);

    const expectedRowContents = [
      'Report nameStatusRequested byRequested onOutput formatParametersActions',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-12 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-11 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-10 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'Generic Encounter ReportCompletedAdmin User2025-11-13 10:30Web PreviewstartDate: 2025-11-01, endDate: 2025-11-13, location: Main ClinicViewPreserveDelete',
      'Patient Demographics ReportCompletedSystem Administrator2025-11-13 09:15Generic Encounter Report.xlslocation: All Locations, ageGroup: AdultDownloadPreserveDelete',
    ];

    expectedRowContents.forEach((expectedContent, index) => {
      expect(rowTexts[index]).toBe(expectedContent);
    });

    const viewButtons = screen.queryAllByText('View');
    expect(viewButtons.length).toBe(1);
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
    const allRows = screen.getAllByRole('row');
    expect(allRows.length).toBe(6);
    const rowTexts = allRows.map((row) => row.textContent);

    const expectedRowContents = [
      'Report nameStatusRequested byRequested onOutput formatParametersActions',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-12 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-11 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'OPD/IPD ReportFailedRUHINYURAMPUNZI RUHINYURAMPUNZI RUHINYURAMPUNZI2025-11-10 12:00CsvReportRendererstartDate: 2025-05-06, endDate: 2025-05-06, department: Pediatric ServiceDelete',
      'Generic Encounter ReportCompletedAdmin User2025-11-13 10:30Web PreviewstartDate: 2025-11-01, endDate: 2025-11-13, location: Main ClinicDownloadPreserveDelete',
      'Patient Demographics ReportCompletedSystem Administrator2025-11-13 09:15Generic Encounter Report.xlslocation: All Locations, ageGroup: AdultDownloadPreserveDelete',
    ];

    expectedRowContents.forEach((expectedContent, index) => {
      expect(rowTexts[index]).toBe(expectedContent);
    });

    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(2);

    const viewButtons = screen.queryAllByText('View');
    expect(viewButtons).toHaveLength(0);
  });
});
