import React, { Children } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LinkStudiesWorkspace from './link-studies.workspace';
import * as api from '../../api';
import { launchWorkspace, showSnackbar } from '@openmrs/esm-framework';

jest.mock('../../api');
jest.mock('@openmrs/esm-framework', () => ({
  __esModule: true,
  launchWorkspace: jest.fn(),
  showSnackbar: jest.fn(),
  createErrorHandler: jest.fn(),
  useLayoutType: jest.fn(() => 'desktop'),
  ExtensionSlot: ({ name }: any) => <div data-testid={`extension-slot-${name}`} />,
  ResponsiveWrapper: ({ children }: any) => <div data-testid="responsive-wrapper">{children}</div>,
}));

describe('LinkStudiesWorkspace', () => {
  const patientUuid = 'patient-123';
  const mockParam = jest.fn();

  const orthancConfigMock = [{ id: 1, orthancBaseUrl: 'http://orthanc.local' }];

  const setup = () => {
    render(
      <LinkStudiesWorkspace
        patientUuid={patientUuid}
        closeWorkspace={mockParam}
        patient={undefined}
        promptBeforeClosing={jest.fn()}
        closeWorkspaceWithSavedChanges={jest.fn()}
        setTitle={jest.fn()}
      />,
    );
  };

  const selectOrthancServer = () => {
    const comboBox = screen.getByRole('combobox');
    fireEvent.change(comboBox, { target: { value: orthancConfigMock[0].orthancBaseUrl } });
    fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
    fireEvent.keyDown(comboBox, { key: 'Enter' });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (api.useOrthancConfigurations as jest.Mock).mockReturnValue({ data: orthancConfigMock });
  });

  beforeAll(() => {
    // Fix Carbon ComboBox + jsdom issue
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders from elements', () => {
    setup();

    expect(screen.getByText(/Fetch option for link studies/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthanc configurations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Study/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('submits from successfully', async () => {
    const getLinkStudiesMock = (api.getLinkStudies as jest.Mock).mockResolvedValue({});
    setup();

    selectOrthancServer();
    fireEvent.click(screen.getByRole('button', { name: /Fetch Study/i }));

    await waitFor(() => {
      expect(getLinkStudiesMock).toHaveBeenCalled();
      expect(mockParam).toHaveBeenCalled();
      expect(launchWorkspace).toHaveBeenCalledWith(expect.any(String), {
        configuration: orthancConfigMock[0],
      });
    });
  });

  it('shows error snackbar when getLinkStudies fails', async () => {
    const error = new Error('Server unreachable');
    (api.getLinkStudies as jest.Mock).mockRejectedValue(error);
    setup();

    selectOrthancServer();
    fireEvent.click(screen.getByRole('button', { name: /fetch study/i }));

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'error',
          subtitle: expect.stringContaining('Server unreachable'),
        }),
      );
    });
  });

  it('closes workspace when Cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockParam).toHaveBeenCalled();
  });
});
