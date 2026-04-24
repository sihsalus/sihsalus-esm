import React from 'react';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';

import NotificationsMenuPanel from './notifications-menu-panel.component';

vi.mock('@openmrs/esm-framework', () => ({
  __esModule: true,
  ExtensionSlot: vi.fn(({ children }) => <>{children}</>),
}));

test('renders the notifications menu panel scaffold', () => {
  render(<NotificationsMenuPanel expanded />);

  expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument();
});
