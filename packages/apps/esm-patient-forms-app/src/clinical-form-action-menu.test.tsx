import { ActionMenuButton } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ClinicalFormActionMenu from './clinical-form-action-menu.component';

void React;

const mockActionMenuButton = jest.mocked(ActionMenuButton);
const mockUseLaunchWorkspaceRequiringVisit = useLaunchWorkspaceRequiringVisit as jest.Mock;

mockActionMenuButton.mockImplementation(({ label }) => <button>{label}</button>);

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    useLaunchWorkspaceRequiringVisit: jest.fn(),
  };
});

beforeEach(() => {
  mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(jest.fn());
});

test('should display clinical form action menu button', () => {
  render(<ClinicalFormActionMenu />);

  expect(screen.getByRole('button', { name: /clinical forms/i })).toBeInTheDocument();
});
