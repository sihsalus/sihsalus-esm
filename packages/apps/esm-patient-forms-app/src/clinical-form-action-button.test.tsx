import { ActionMenuButton2 } from '@openmrs/esm-framework';
import { useStartVisitIfNeeded } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ClinicalFormActionButton from './clinical-form-action-button.component';

void React;

const mockActionMenuButton2 = jest.mocked(ActionMenuButton2);
const mockUseStartVisitIfNeeded = useStartVisitIfNeeded as jest.Mock;

mockActionMenuButton2.mockImplementation(({ label }: { label?: React.ReactNode }) => <button>{label}</button>);

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    useStartVisitIfNeeded: jest.fn(),
  };
});

beforeEach(() => {
  mockUseStartVisitIfNeeded.mockReturnValue(jest.fn().mockResolvedValue(true));
});

test('should display clinical form action button', () => {
  render(
    <ClinicalFormActionButton
      groupProps={{
        patientUuid: 'patient-uuid',
        patient: null,
        visitContext: null,
        mutateVisitContext: null,
      }}
    />,
  );

  expect(screen.getByRole('button', { name: /clinical forms/i })).toBeInTheDocument();
});
