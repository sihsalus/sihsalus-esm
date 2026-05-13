import { render, screen } from '@testing-library/react';

import Root from './root.component';

jest.mock('@openmrs/esm-framework', () => ({
  useLeftNav: jest.fn(),
}));

jest.mock('@sihsalus/esm-rbac', () => ({
  AppErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('./pages/admission-home.component', () => ({
  __esModule: true,
  default: () => <div>Admission home route</div>,
}));

jest.mock('./pages/patient-merge.component', () => ({
  __esModule: true,
  default: () => <div>Patient merge route</div>,
}));

jest.mock('./patient/patient-admission-detail.component', () => ({
  __esModule: true,
  default: () => <div>Patient admission detail route</div>,
}));

describe('Root', () => {
  beforeEach(() => {
    globalThis.getOpenmrsSpaBase = jest.fn(() => '/openmrs/spa/');
  });

  it('renders the admission home route', () => {
    window.history.pushState({}, 'Admission', '/openmrs/spa/admission');

    render(<Root />);

    expect(screen.getByText('Admission home route')).toBeInTheDocument();
  });

  it('renders the duplicate patient merge route', () => {
    window.history.pushState({}, 'Admission merge', '/openmrs/spa/admission/merge');

    render(<Root />);

    expect(screen.getByText('Patient merge route')).toBeInTheDocument();
  });

  it('renders the patient admission detail route', () => {
    window.history.pushState({}, 'Patient admission detail', '/openmrs/spa/admission/patient/patient-uuid');

    render(<Root />);

    expect(screen.getByText('Patient admission detail route')).toBeInTheDocument();
  });
});
