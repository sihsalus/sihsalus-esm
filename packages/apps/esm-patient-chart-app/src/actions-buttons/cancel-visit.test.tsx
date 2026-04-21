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

import { useVisit } from '@openmrs/esm-framework';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCurrentVisit } from 'test-utils';
import React from 'react';

import CancelVisitOverflowMenuItem from './cancel-visit.component';

const mockUseVisit = jest.mocked(useVisit);

describe('CancelVisitOverflowMenuItem', () => {
  it('should launch cancel visit dialog box', async () => {
    const user = userEvent.setup();

    mockUseVisit.mockReturnValueOnce({ currentVisit: mockCurrentVisit } as ReturnType<typeof useVisit>);

    render(React.createElement(CancelVisitOverflowMenuItem, { patientUuid: 'some-uuid' }));

    const cancelVisitButton = screen.getByRole('menuitem', { name: /cancel visit/i });
    expect(cancelVisitButton).toBeInTheDocument();

    await user.click(cancelVisitButton);
  });
});
