import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Flags from './flags.component';
import { usePatientFlags, type PatientFlag } from './hooks/usePatientFlags';

const mockUsePatientFlags = jest.mocked(usePatientFlags);

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  launchPatientWorkspace: jest.fn(),
}));

jest.mock('./hooks/usePatientFlags', () => ({
  usePatientFlags: jest.fn(),
}));

const patientUuid = 'test-patient-uuid';

const testFlags: Array<PatientFlag> = [
  {
    uuid: 'flag-1',
    message: 'Patient needs to be followed up',
    voided: false,
    flag: { uuid: 'f1', display: 'Needs follow up' },
    patient: { uuid: patientUuid, display: 'Test Patient' },
    tags: [
      { uuid: 't1', display: 'risk' },
      { uuid: 't2', display: 'flag type-social' },
    ],
    auditInfo: { dateCreated: '2026-01-01T00:00:00.000Z' },
  },
  {
    uuid: 'flag-2',
    message: 'Diagnosis for the patient is unknown',
    voided: false,
    flag: { uuid: 'f2', display: 'Unknown diagnosis' },
    patient: { uuid: patientUuid, display: 'Test Patient' },
    tags: [
      { uuid: 't3', display: 'risk' },
      { uuid: 't4', display: 'flag type-medical' },
    ],
    auditInfo: { dateCreated: '2026-01-02T00:00:00.000Z' },
  },
  {
    uuid: 'flag-3',
    message: 'Patient has a future appointment scheduled',
    voided: false,
    flag: { uuid: 'f3', display: 'Future appointment' },
    patient: { uuid: patientUuid, display: 'Test Patient' },
    tags: [
      { uuid: 't5', display: 'info' },
      { uuid: 't6', display: 'flag type-appointment' },
    ],
    auditInfo: { dateCreated: '2026-01-03T00:00:00.000Z' },
  },
];

it('renders flags in the patient flags slot', async () => {
  const user = userEvent.setup();

  mockUsePatientFlags.mockReturnValue({
    error: null,
    flags: testFlags,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
  } as ReturnType<typeof usePatientFlags>);

  render(<Flags patientUuid={patientUuid} onHandleCloseHighlightBar={jest.fn()} showHighlightBar={false} />);

  const flags = screen.getAllByRole('button', { name: /flag/i });
  expect(flags).toHaveLength(3);
  expect(screen.getByText(/patient needs to be followed up/i)).toBeInTheDocument();
  expect(screen.getByText(/diagnosis for the patient is unknown/i)).toBeInTheDocument();
  expect(screen.getByText(/patient has a future appointment scheduled/i)).toBeInTheDocument();

  const editButton = screen.getByRole('button', { name: /edit/i });
  expect(editButton).toBeInTheDocument();

  await user.click(editButton);

  expect(launchPatientWorkspace).toHaveBeenCalledWith('edit-flags-side-panel-form');
});
