import { render } from '@testing-library/react';
import React from 'react';
import { waitForLoadingToFinish } from 'test-utils';
import BillableServicesDashboard from './dashboard.component';

test('renders an empty state when there are no services', async () => {
  renderBillingDashboard();
  await waitForLoadingToFinish();
});

function renderBillingDashboard() {
  render(<BillableServicesDashboard />);
}
