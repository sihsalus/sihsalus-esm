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

import { showModal } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AddPastVisitOverflowMenuItem from './add-past-visit.component';

const mockShowModal = jest.mocked(showModal);

describe('AddPastVisitOverflowMenuItem', () => {
  it('should launch the start past visit modal', async () => {
    const user = userEvent.setup();

    render(React.createElement(AddPastVisitOverflowMenuItem));

    const addPastVisitButton = screen.getByRole('menuitem', { name: /Add past visit/ });
    expect(addPastVisitButton).toBeInTheDocument();

    await user.click(addPastVisitButton);
    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(mockShowModal).toHaveBeenCalledWith(
      'start-visit-dialog',
      expect.objectContaining({
        launchPatientChart: undefined,
        patientUuid: undefined,
      }),
    );
  });
});
