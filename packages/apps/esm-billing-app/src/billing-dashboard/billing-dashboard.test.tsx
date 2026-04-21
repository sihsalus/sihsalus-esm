import React from 'react';
import { screen, render } from '@testing-library/react';
import { BillingDashboard } from './billing-dashboard.component';

test('renders the billing dashboard', () => {
  renderBillingDashboard();

  expect(screen.getByTestId('billing-header')).toBeInTheDocument();
});

function renderBillingDashboard() {
  render(<BillingDashboard />);
}
