import { navigate } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AdmissionAppMenuLink from './admission-app-menu-link.component';
import AdmissionDashboardLink from './admission-dashboard-link.component';
import AdmissionMergePatientsAction from './admission-merge-patients-action.component';

jest.mock('@openmrs/esm-framework', () => {
  const React = require('react');

  return {
    ConfigurableLink: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    navigate: jest.fn(),
  };
});

const mockNavigate = jest.mocked(navigate);

describe('admission navigation links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.getOpenmrsSpaBase = jest.fn(() => '/openmrs/spa/');
    globalThis.spaBase = '/openmrs/spa';
  });

  it('renders the app menu link to the admission app', () => {
    render(<AdmissionAppMenuLink />);

    expect(screen.getByRole('link', { name: /admisión/i })).toHaveAttribute('href', '/openmrs/spa/admission');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders the dashboard tile link to the admission app', () => {
    render(<AdmissionDashboardLink />);

    expect(screen.getByRole('link', { name: /admisión reporte de admisiones por ups/i })).toHaveAttribute(
      'href',
      '/openmrs/spa/admission',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates directly to the merge route from the top nav action', async () => {
    const user = userEvent.setup();
    render(<AdmissionMergePatientsAction />);

    await user.click(screen.getByRole('button', { name: /fusionar historias/i }));

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/openmrs/spa/admission/merge' });
  });
});
