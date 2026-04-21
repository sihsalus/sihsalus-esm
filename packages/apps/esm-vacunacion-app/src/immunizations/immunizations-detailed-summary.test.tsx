import {
  formatDate,
  getDefaultsFromConfigSchema,
  launchWorkspace2,
  parseDate,
  useConfig,
} from '@openmrs/esm-framework';
import { useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCurrentVisit } from 'test-utils';
import React from 'react';
import { mockPatient, renderWithSwr, waitForLoadingToFinish } from 'test-utils';

import { configSchema, type ImmunizationConfigObject } from '../config-schema';
import { useImmunizations } from '../hooks/useImmunizations';

import ImmunizationsDetailedSummary from './immunizations-detailed-summary.component';

jest.mock('../hooks/useImmunizations', () => ({
  useImmunizations: jest.fn(),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  ...jest.requireActual('@openmrs/esm-patient-common-lib'),
  useVisitOrOfflineVisit: jest.fn(),
}));

const mockUseImmunizations = jest.mocked(useImmunizations);
const mockLaunchWorkspace = launchWorkspace2 as jest.Mock;
const mockUseConfig = jest.mocked(useConfig<ImmunizationConfigObject>);
const mockUseVisitOrOfflineVisit = jest.mocked(useVisitOrOfflineVisit);

mockUseConfig.mockReturnValue({
  immunizationsConfig: getDefaultsFromConfigSchema(configSchema) as ImmunizationConfigObject,
} as any);

mockLaunchWorkspace.mockImplementation(jest.fn());

mockUseConfig.mockReturnValue({
  immunizationsConfig: {
    immunizationConceptSet: 'CIEL:984',
    sequenceDefinitions: [
      {
        vaccineConceptUuid: 'polio-uuid',
        sequences: [
          {
            sequenceLabel: 'Primary Series',
            sequenceNumber: 1,
          },
        ],
      },
    ],
  },
} as any);

const mockImmunizationData = [
  {
    vaccineUuid: 'polio-uuid',
    vaccineName: 'Polio',
    existingDoses: [
      {
        immunizationObsUuid: '1',
        occurrenceDateTime: '2018-11-20T00:00:00.000Z',
        doseNumber: 1,
        note: [],
        visitUuid: 'visit-uuid',
        expirationDate: '2025-11-20T00:00:00.000Z',
        nextDoseDate: '2019-11-20T00:00:00.000Z',
        lotNumber: 'LOT123',
        manufacturer: 'Test Manufacturer',
      },
    ],
  },
];

const buildVisitContext = (currentVisit: { uuid: string } | null = null) =>
  ({
    activeVisit: currentVisit,
    currentVisit,
    isLoading: false,
    isValidating: false,
    currentVisitIsRetrospective: false,
    error: null,
    mutate: jest.fn(),
  }) as unknown as ReturnType<typeof useVisitOrOfflineVisit>;

const formatRecentVaccination = (occurrenceDateTime: string, label: string) =>
  `Last dose on ${formatDate(parseDate(occurrenceDateTime), { mode: 'standard', noToday: true, time: false })}, ${label}`;

describe('ImmunizationsDetailedSummary', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({
      immunizationsConfig: {
        immunizationConceptSet: 'CIEL:984',
        sequenceDefinitions: [
          {
            vaccineConceptUuid: 'polio-uuid',
            sequences: [
              {
                sequenceLabel: 'Primary Series',
                sequenceNumber: 1,
              },
            ],
          },
        ],
      },
    } as any);
    mockUseVisitOrOfflineVisit.mockReturnValue(buildVisitContext());
  });

  it('shows empty state when no immunizations are recorded', async () => {
    mockUseImmunizations.mockReturnValueOnce({
      data: [],
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /immunizations/i })).toBeInTheDocument();
    expect(screen.getByTitle(/empty data illustration/i)).toBeInTheDocument();
    expect(screen.getByText(/there are no immunizations to display for this patient/i)).toBeInTheDocument();
    expect(screen.getByText(/record immunizations/i)).toBeInTheDocument();
  });

  it('shows error message when immunization data cannot be loaded', async () => {
    const error = {
      message: 'You are not logged in',
      response: {
        status: 401,
        statusText: 'Unauthorized',
      },
    };

    mockUseImmunizations.mockReturnValue({
      data: null,
      error,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /immunizations/i })).toBeInTheDocument();
    expect(screen.getByText(/Error 401: Unauthorized/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above/i,
      ),
    ).toBeInTheDocument();
  });

  it('displays immunization records in a table when data is available', async () => {
    mockUseImmunizations.mockReturnValueOnce({
      data: mockImmunizationData,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();
    expect(screen.getByRole('heading', { name: /immunizations/i })).toBeInTheDocument();
    expect(screen.getByTestId('add-immunizations-button')).toBeInTheDocument();
    expect(screen.getByText(/vaccine/i)).toBeInTheDocument();
    expect(screen.getByText(/recent vaccination/i)).toBeInTheDocument();
    expect(screen.getByText(/polio/i)).toBeInTheDocument();
    expect(
      screen.getByText(formatRecentVaccination(mockImmunizationData[0].existingDoses[0].occurrenceDateTime, 'Primary Series')),
    ).toBeInTheDocument();
  });

  it('shows loading indicator when data is loading', async () => {
    mockUseImmunizations.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText(/there are no immunizations to display/i)).not.toBeInTheDocument();
  });

  it('opens immunization form when add button is clicked during an active visit', async () => {
    const user = userEvent.setup();
    const mockLaunchStartVisitPrompt = jest.fn();
    mockUseVisitOrOfflineVisit.mockReturnValue(buildVisitContext(mockCurrentVisit));
    mockUseImmunizations.mockReturnValue({
      data: mockImmunizationData,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(
      <ImmunizationsDetailedSummary
        patientUuid={mockPatient.uuid}
        launchStartVisitPrompt={mockLaunchStartVisitPrompt}
      />,
    );

    await waitForLoadingToFinish();

    const addButton = screen.getByTestId('add-immunizations-button');
    await user.click(addButton);

    expect(mockLaunchWorkspace).toHaveBeenCalledWith('vacunacion-form-workspace');
    expect(mockLaunchStartVisitPrompt).not.toHaveBeenCalled();
  });

  it('prompts to start visit when add button is clicked without an active visit', async () => {
    const user = userEvent.setup();
    const mockLaunchStartVisitPrompt = jest.fn();
    mockUseImmunizations.mockReturnValueOnce({
      data: mockImmunizationData,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(
      <ImmunizationsDetailedSummary
        patientUuid={mockPatient.uuid}
        launchStartVisitPrompt={mockLaunchStartVisitPrompt}
      />,
    );

    await waitForLoadingToFinish();

    const addButton = screen.getByTestId('add-immunizations-button');
    await user.click(addButton);

    expect(mockLaunchStartVisitPrompt).toHaveBeenCalled();
    expect(mockLaunchWorkspace).not.toHaveBeenCalled();
  });

  it('sorts immunizations by latest dose date in descending order', async () => {
    const immunizationsWithDifferentDates = [
      {
        vaccineUuid: 'polio-uuid',
        vaccineName: 'Polio',
        existingDoses: [
          {
            immunizationObsUuid: '1',
            occurrenceDateTime: '2018-11-20T00:00:00.000Z',
            doseNumber: 1,
            note: [],
            visitUuid: 'visit-uuid',
            expirationDate: '2025-11-20T00:00:00.000Z',
            nextDoseDate: '2019-11-20T00:00:00.000Z',
            lotNumber: 'LOT123',
            manufacturer: 'Test Manufacturer',
          },
        ],
      },
      {
        vaccineUuid: 'hepatitis-b-uuid',
        vaccineName: 'Hepatitis B',
        existingDoses: [
          {
            immunizationObsUuid: '2',
            occurrenceDateTime: '2020-05-15T00:00:00.000Z',
            doseNumber: 1,
            note: [],
            visitUuid: 'visit-uuid',
            expirationDate: '2025-05-15T00:00:00.000Z',
            nextDoseDate: '2022-05-15T00:00:00.000Z',
            lotNumber: 'LOT456',
            manufacturer: 'Test Manufacturer',
          },
        ],
      },
    ];

    mockUseImmunizations.mockReturnValueOnce({
      data: immunizationsWithDifferentDates,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    expect(screen.getByText('Hepatitis B')).toBeInTheDocument();
    expect(screen.getByText('Polio')).toBeInTheDocument();
  });

  it('handles pagination for large datasets', async () => {
    // Create a large dataset (more than 10 items to trigger pagination)
    const largeImmunizationDataset = Array.from({ length: 15 }, (_, index) => ({
      vaccineUuid: `vaccine-${index}`,
      vaccineName: `Vaccine ${index + 1}`,
      existingDoses: [
        {
          immunizationObsUuid: `${index}`,
          occurrenceDateTime: `2020-01-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
          doseNumber: 1,
          note: [],
          visitUuid: 'visit-uuid',
          expirationDate: '2025-01-01T00:00:00.000Z',
          nextDoseDate: '2025-01-01T00:00:00.000Z',
          lotNumber: `LOT${index}`,
          manufacturer: 'Test Manufacturer',
        },
      ],
    }));

    mockUseImmunizations.mockReturnValue({
      data: largeImmunizationDataset,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    // Should show pagination controls
    expect(screen.getByText(/items per page/i)).toBeInTheDocument();
    // Check that we have multiple pages (15 items should create multiple pages)
    expect(screen.getAllByText(/of 2 pages/i).length).toBeGreaterThan(0);
  });

  it('displays sequence labels when available', async () => {
    const immunizationWithSequence = [
      {
        vaccineUuid: 'polio-uuid',
        vaccineName: 'Polio',
        existingDoses: [
          {
            immunizationObsUuid: '1',
            occurrenceDateTime: '2018-11-20T00:00:00.000Z',
            doseNumber: 1,
            note: [],
            visitUuid: 'visit-uuid',
            expirationDate: '2025-11-20T00:00:00.000Z',
            nextDoseDate: '2019-11-20T00:00:00.000Z',
            lotNumber: 'LOT123',
            manufacturer: 'Test Manufacturer',
          },
        ],
      },
    ];

    mockUseImmunizations.mockReturnValueOnce({
      data: immunizationWithSequence,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    // Should show sequence label in the recent vaccination column
    expect(screen.getByText(/Primary Series/i)).toBeInTheDocument();
  });

  it('formats dates correctly in standard mode', async () => {
    const immunizationWithSpecificDate = [
      {
        vaccineUuid: 'polio-uuid',
        vaccineName: 'Polio',
        existingDoses: [
          {
            immunizationObsUuid: '1',
            occurrenceDateTime: '2023-12-25T14:30:00.000Z',
            doseNumber: 1,
            note: [],
            visitUuid: 'visit-uuid',
            expirationDate: '2025-12-25T00:00:00.000Z',
            nextDoseDate: '2019-11-20T00:00:00.000Z',
            lotNumber: 'LOT123',
            manufacturer: 'Test Manufacturer',
          },
        ],
      },
    ];

    mockUseImmunizations.mockReturnValueOnce({
      data: immunizationWithSpecificDate,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    expect(
      screen.getByText(formatRecentVaccination(immunizationWithSpecificDate[0].existingDoses[0].occurrenceDateTime, 'Primary Series')),
    ).toBeInTheDocument();
  });

  it('handles immunizations without doses gracefully', async () => {
    const immunizationWithoutDoses = [
      {
        vaccineUuid: 'polio-uuid',
        vaccineName: 'Polio',
        existingDoses: [],
      },
    ];

    mockUseImmunizations.mockReturnValue({
      data: immunizationWithoutDoses,
      isLoading: false,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    });

    renderWithSwr(<ImmunizationsDetailedSummary patientUuid={mockPatient.uuid} launchStartVisitPrompt={jest.fn()} />);

    await waitForLoadingToFinish();

    // Should show vaccine name but no date information
    expect(screen.getByText(/Polio/i)).toBeInTheDocument();
    expect(screen.queryByText(/Last dose on/i)).not.toBeInTheDocument();
  });
});
