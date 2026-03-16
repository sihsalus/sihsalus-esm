import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as api from '../../api';
import AddNewRequestWorkspace from './add-request-form.workspace';
import { showSnackbar } from '@openmrs/esm-framework';
import userEvent from '@testing-library/user-event';

jest.mock('../../api');
jest.mock('@openmrs/esm-framework', () => ({
  showSnackbar: jest.fn(),
  createErrorHandler: jest.fn(),
  useLayoutType: jest.fn().mockReturnValue('desktop'),
  ResponsiveWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('AddNewProcedureStepWorkspace', () => {
  const patientUuid = 'patient-123';
  const mockClose = jest.fn();
  const mockCloseWithChanges = jest.fn();
  const orthancConfigMock = [{ id: 1, orthancBaseUrl: 'http://orthanc.local', orthancProxyUrl: '' }];

  const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByPlaceholderText(/Select an Orthanc server/i));
    await user.click(await screen.findByText(/orthanc.local/i));
    await user.type(screen.getByTestId(/accessionNumber/i), 'ACC123');
    await user.type(screen.getByLabelText(/Physician/i), 'Dr. ABC');
    await user.type(screen.getByLabelText(/Request procedure description/i), 'Test procedure');
    await user.click(screen.getByPlaceholderText(/Select the request priority/i));
    await user.click(screen.getByText(/low/i));
  };

  const defaultProps = {
    patientUuid,
    patient: null,
    closeWorkspace: mockClose,
    closeWorkspaceWithSavedChanges: mockCloseWithChanges,
    promptBeforeClosing: jest.fn(),
    setTitle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    (api.useOrthancConfigurations as jest.Mock).mockReturnValue({
      data: [{ id: 1, orthancBaseUrl: 'http://orthanc.local', orthancProxyUrl: '' }],
    });
    (api.useRequestsByPatient as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (api.saveRequestProcedure as jest.Mock).mockResolvedValue({});
  });

  it('renders form fields correctly', () => {
    render(
      <AddNewRequestWorkspace
        patientUuid={patientUuid}
        closeWorkspace={mockClose}
        patient={null}
        promptBeforeClosing={jest.fn()}
        closeWorkspaceWithSavedChanges={jest.fn()}
        setTitle={jest.fn()}
      />,
    );

    expect(screen.getByTestId(/accessionNumber/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Physician/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Request procedure description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save and Close/i })).toBeInTheDocument();
  });

  it('show validation errors when submitting empty form', async () => {
    render(
      <AddNewRequestWorkspace
        patientUuid={patientUuid}
        patient={null}
        closeWorkspace={mockClose}
        promptBeforeClosing={jest.fn()}
        closeWorkspaceWithSavedChanges={jest.fn()}
        setTitle={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Save and Close/i }));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });

  it('generates accession number when clicking button', async () => {
    render(
      <AddNewRequestWorkspace
        patientUuid={patientUuid}
        patient={null}
        closeWorkspace={mockClose}
        promptBeforeClosing={jest.fn()}
        closeWorkspaceWithSavedChanges={jest.fn()}
        setTitle={jest.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /Generate number/i });
    fireEvent.click(button);

    await waitFor(() => expect((screen.getByTestId(/accessionNumber/i) as HTMLInputElement).value).not.toBe(''));
  });

  it('submits form successfully', async () => {
    const user = userEvent.setup();

    render(<AddNewRequestWorkspace {...defaultProps} />);

    const comboBox = screen.getByPlaceholderText(/Select an Orthanc server/i);
    await user.click(comboBox);
    const option = await screen.findByText(/orthanc.local/i);
    await user.click(option);

    await user.type(screen.getByTestId(/accessionNumber/i), 'ACC123');
    await user.type(screen.getByLabelText(/Physician/i), 'Dr.ABC');
    await user.type(screen.getByLabelText(/Request procedure description/i), 'Chest X-ray');

    const priorityBox = screen.getByPlaceholderText(/Select the request priority/i);
    await user.click(priorityBox);
    const priorityOption = await screen.findByText(/low/i);
    await user.click(priorityOption);

    await user.click(screen.getByRole('button', { name: /Save and Close/i }));

    await waitFor(() => {
      expect(api.saveRequestProcedure).toHaveBeenCalledWith(
        expect.objectContaining({
          accessionNumber: 'ACC123',
          orthancConfiguration: orthancConfigMock[0],
          requestingPhysician: 'Dr.ABC',
          requestDescription: 'Chest X-ray',
          priority: 'low',
        }),
        patientUuid,
        expect.any(AbortController),
      );
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'success',
          title: 'Request saved successfully',
        }),
      );
      expect(mockCloseWithChanges).toHaveBeenCalled();
    });
  });

  it('shows error snackbar on save failure', async () => {
    const user = userEvent.setup();
    (api.saveRequestProcedure as jest.Mock).mockRejectedValue(new Error('Save failed'));

    render(<AddNewRequestWorkspace {...defaultProps} />);

    await fillForm(user);

    await user.click(screen.getByRole('button', { name: /Save and Close/i }));

    await waitFor(() => {
      expect(api.saveRequestProcedure).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'error',
          subtitle: 'Save failed',
        }),
      );
    });
  });

  it('calls closeWorkSpace on discard', async () => {
    render(
      <AddNewRequestWorkspace
        patientUuid={patientUuid}
        closeWorkspace={mockClose}
        closeWorkspaceWithSavedChanges={mockCloseWithChanges}
        promptBeforeClosing={jest.fn()}
        setTitle={jest.fn()}
        patient={null}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Discard/i }));
    expect(mockClose).toHaveBeenCalled();
  });
});
