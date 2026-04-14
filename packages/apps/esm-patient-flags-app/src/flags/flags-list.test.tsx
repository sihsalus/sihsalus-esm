import { render, screen } from '@testing-library/react';
import React from 'react';

import FlagsList from './flags-list.component';
import { usePatientFlags, type PatientFlag } from './hooks/usePatientFlags';

const mockUsePatientFlags = jest.mocked(usePatientFlags);

jest.mock('./hooks/usePatientFlags', () => ({
  usePatientFlags: jest.fn(),
}));

const patientUuid = 'test-patient-uuid';

const testFlags: Array<PatientFlag> = [
  {
    uuid: 'flag-1',
    message: 'Patient has a future appointment scheduled',
    voided: false,
    flag: { uuid: 'f1', display: 'Future appointment' },
    patient: { uuid: patientUuid, display: 'Test Patient' },
    tags: [
      { uuid: 't1', display: 'risk' },
      { uuid: 't2', display: 'flag type-social' },
    ],
    auditInfo: { dateCreated: '2026-01-01T00:00:00.000Z' },
  },
  {
    uuid: 'flag-2',
    message: 'Patient needs to be followed up',
    voided: false,
    flag: { uuid: 'f2', display: 'Needs follow up' },
    patient: { uuid: patientUuid, display: 'Test Patient' },
    tags: [
      { uuid: 't3', display: 'info' },
      { uuid: 't4', display: 'flag type-clinical' },
    ],
    auditInfo: { dateCreated: '2026-01-02T00:00:00.000Z' },
  },
];

it('renders an Edit form that enables users to toggle flags on or off', () => {
  mockUsePatientFlags.mockReturnValue({
    flags: testFlags,
    isLoading: false,
    error: null,
    isValidating: false,
    mutate: jest.fn(),
  } as ReturnType<typeof usePatientFlags>);

  render(
    <FlagsList
      closeWorkspace={jest.fn()}
      closeWorkspaceWithSavedChanges={jest.fn()}
      patientUuid={patientUuid}
      promptBeforeClosing={jest.fn()}
      setTitle={jest.fn()}
    />,
  );

  const searchbox = screen.getByRole('searchbox', { name: /search for a flag/i });
  const clearSearchInputButton = screen.getByRole('button', { name: /clear search input/i });
  const discardButton = screen.getByRole('button', { name: /discard/i });
  const saveButton = screen.getByRole('button', { name: /save & close/i });

  expect(searchbox).toBeInTheDocument();
  expect(clearSearchInputButton).toBeInTheDocument();
  expect(discardButton).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(screen.getByText(/future appointment/i)).toBeInTheDocument();
  expect(screen.getByText(/needs follow up/i)).toBeInTheDocument();
  expect(screen.getByText(/social/i)).toBeInTheDocument();
});
