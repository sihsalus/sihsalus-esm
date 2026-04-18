import { ActionMenuButton, useLayoutType, useWorkspaces } from '@openmrs/esm-framework';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ClinicalFormActionButton from './clinical-form-action-button.component';

const mockUseLayoutType = jest.mocked(useLayoutType);
const mockUseWorkspaces = useWorkspaces as jest.Mock;
const mockActionMenuButton = jest.mocked(ActionMenuButton);
const mockUseLaunchWorkspaceRequiringVisit = useLaunchWorkspaceRequiringVisit as jest.Mock;

mockActionMenuButton.mockImplementation(({ handler, label, tagContent }) => (
  <button onClick={handler}>
    {tagContent} {label}
  </button>
));

mockUseWorkspaces.mockImplementation(() => ({
  active: true,
  windowState: 'normal',
  workspaces: [
    {
      canHide: false,
      name: 'clinical-forms-workspace',
      title: 'Clinical forms',
      preferredWindowSize: 'normal',
      type: 'form',
    },
  ],
  workspaceWindowState: 'normal',
  prompt: null,
}));

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

test('should display clinical form action button on tablet view', () => {
  mockUseLayoutType.mockReturnValue('tablet');

  render(<ClinicalFormActionButton />);
  expect(screen.getByRole('button', { name: /Clinical forms/i })).toBeInTheDocument();
});

test('should display clinical form action button on desktop view', () => {
  mockUseLayoutType.mockReturnValue('small-desktop');

  render(<ClinicalFormActionButton />);
  const clinicalActionButton = screen.getByRole('button', { name: /Form/i });
  expect(clinicalActionButton).toBeInTheDocument();
});
