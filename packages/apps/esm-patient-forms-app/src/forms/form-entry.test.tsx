import { ExtensionSlot, useConnectivity, usePatient } from '@openmrs/esm-framework';
import { useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { BehaviorSubject } from 'rxjs';
import { mockPatient } from 'test-utils';

import FormEntry from './form-entry.workspace';

const testProps = {
  closeWorkspace: jest.fn(),
  closeWorkspaceWithSavedChanges: jest.fn(),
  promptBeforeClosing: jest.fn(),
  patientUuid: mockPatient.uuid,
  formInfo: { formUuid: 'some-form-uuid' },
  mutateForm: jest.fn(),
  setTitle: jest.fn(),
};

const mockFormEntrySub = jest.fn();
const mockExtensionSlot = jest.mocked(ExtensionSlot);
const mockUseConnectivity = jest.mocked(useConnectivity);
const mockUseVisitOrOfflineVisit = useVisitOrOfflineVisit as jest.Mock;
const mockUsePatient = jest.mocked(usePatient);

const mockCurrentVisit = {
  uuid: '17f512b4-d264-4113-a6fe-160cb38cb46e',
  encounters: [],
  patient: { uuid: '8673ee4f-e2ab-4077-ba55-4980f408773e' },
  visitType: {
    uuid: '7b0f5697-27e3-40c4-8bae-f4049abfb4ed',
    display: 'Facility Visit',
  },
  attributes: [],
  startDatetime: new Date('2021-03-16T08:16:00.000+0000'),
  stopDatetime: null,
  location: {
    uuid: '6351fcf4-e311-4a19-90f9-35667d99a8af',
    name: 'Registration Desk',
    display: 'Registration Desk',
  },
};

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  useVisitOrOfflineVisit: jest.fn(),
}));

jest.mock('@openmrs/esm-framework', () => ({
  ExtensionSlot: jest.fn().mockImplementation(({ name }) => name),
  usePatient: jest.fn(),
  useConnectivity: jest.fn(),
}));

describe('FormEntry', () => {
  it('renders an extension where the form entry widget plugs in', async () => {
    mockUsePatient.mockReturnValue({
      patient: mockPatient,
      patientUuid: mockPatient.uuid,
      error: null,
      isLoading: false,
    });
    mockUseVisitOrOfflineVisit.mockReturnValue({ currentVisit: mockCurrentVisit });
    mockUseConnectivity.mockReturnValue(true);
    mockFormEntrySub.mockReturnValue(
      new BehaviorSubject({ encounterUuid: null, formUuid: 'some-form-uuid', patient: mockPatient }),
    );

    render(<FormEntry {...testProps} />);

    await waitFor(() => expect(mockExtensionSlot).toHaveBeenCalled());
    expect(mockExtensionSlot).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'form-widget-slot' }),
      expect.anything(),
    );
  });
});
