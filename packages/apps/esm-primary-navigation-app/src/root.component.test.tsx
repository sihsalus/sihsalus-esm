import {
  type AssignedExtension,
  type Session,
  useAssignedExtensions,
  useConfig,
  useLeftNavStore,
  useSession,
} from '@openmrs/esm-framework';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { of } from 'rxjs';

import { mockSession } from '../test-utils/mocks/mock-session';
import { mockUser } from '../test-utils/mocks/mock-user';

import Root from './root.component';
import { isDesktop } from './utils';

const mockUserObservable = of(mockUser);
const mockSessionObservable = of({ data: mockSession });

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  useConfig: jest.fn(),
  useAssignedExtensions: jest.fn(),
  useSession: jest.fn(),
  useLeftNavStore: jest.fn(),
  interpolateUrl: jest.fn(),
}));

jest.mock('./root.resource', () => ({
  getSynchronizedCurrentUser: jest.fn(() => mockUserObservable),
  getCurrentSession: jest.fn(() => mockSessionObservable),
}));

jest.mock('./utils', () => ({
  isDesktop: jest.fn(() => true),
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <>{children}</>,
  Route: ({ children, element, path }: any) => {
    if (path === 'login/*' || path === 'logout/*') {
      return null;
    }
    return element ?? children;
  },
  Routes: ({ children }: any) => <>{children}</>,
}));

jest.mock('./components/navbar/navbar.component', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Mock EMR</div>,
}));

const mockUseConfig = jest.mocked(useConfig);
const mockUseAssignedExtensions = jest.mocked(useAssignedExtensions);
const mockUseSession = jest.mocked(useSession);
const mockUseLeftNavStore = jest.mocked(useLeftNavStore);
const mockIsDesktop = jest.mocked(isDesktop);

mockUseConfig.mockReturnValue({
  logo: { src: null, alt: null, name: 'Mock EMR', link: 'Mock EMR' },
});
mockUseAssignedExtensions.mockReturnValue(['mock-extension'] as unknown as AssignedExtension[]);
mockUseSession.mockReturnValue(mockSession as unknown as Session);
mockUseLeftNavStore.mockReturnValue({ slotName: '', basePath: '', mode: 'normal' });

describe('Root', () => {
  it('should display navbar with title', async () => {
    render(<Root />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  describe('when view is desktop', () => {
    beforeEach(() => {
      mockIsDesktop.mockImplementation(() => true);
    });

    it('does not render side menu button if desktop', async () => {
      await waitFor(() => expect(screen.queryAllByLabelText('Open menu')).toHaveLength(0));
    });
  });
});
