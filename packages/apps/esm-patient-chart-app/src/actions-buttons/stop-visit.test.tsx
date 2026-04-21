jest.mock('@carbon/react', () => {
  const actual = jest.requireActual('@carbon/react');
  const React = jest.requireActual('react');

  return {
    ...actual,
    OverflowMenuItem: React.forwardRef(function MockOverflowMenuItem({ itemText, onClick, ...props }, ref) {
      return (
        <button {...props} onClick={onClick} ref={ref} role="menuitem" type="button">
          {itemText}
        </button>
      );
    }),
  };
});

import { showModal, useVisit } from '@openmrs/esm-framework';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCurrentVisit } from 'test-utils';
import React from 'react';
import { mockPatient } from 'test-utils';

import StopVisitOverflowMenuItem from './stop-visit.component';

const mockUseVisit = jest.mocked(useVisit);
const mockShowModal = jest.mocked(showModal);

jest.mock('@openmrs/esm-framework', () => ({
  useVisit: jest.fn(),
  showModal: jest.fn(),
  useConfig: jest.fn(),
}));

describe('StopVisitOverflowMenuItem', () => {
  it('should be able to stop current visit', async () => {
    const user = userEvent.setup();

    mockUseVisit.mockReturnValue({ currentVisit: mockCurrentVisit } as ReturnType<typeof useVisit>);

    render(React.createElement(StopVisitOverflowMenuItem, { patientUuid: mockPatient.id }));

    const endVisitButton = screen.getByRole('menuitem', { name: /End Visit/i });
    expect(endVisitButton).toBeInTheDocument();

    await user.click(endVisitButton);
    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });
  it('should be able to show configured label in button to stop current visit', async () => {
    const user = userEvent.setup();

    mockUseVisit.mockReturnValue({ currentVisit: mockCurrentVisit } as ReturnType<typeof useVisit>);

    render(React.createElement(StopVisitOverflowMenuItem, { patientUuid: mockPatient.id }));

    const endVisitButton = screen.getByRole('menuitem', { name: /End visit/ });
    expect(endVisitButton).toBeInTheDocument();

    await user.click(endVisitButton);
    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });
});
