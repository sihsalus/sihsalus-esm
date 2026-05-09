import { render, screen } from '@testing-library/react';
import React from 'react';

import NotificationsMenuPanel from './notifications-menu-panel.component';

jest.mock('@openmrs/esm-framework', () => ({
  __esModule: true,
  ExtensionSlot: jest.fn(({ children }) => <>{children}</>),
}));

test('renders the notifications menu panel scaffold', () => {
  render(<NotificationsMenuPanel expanded />);

  expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument();
});
