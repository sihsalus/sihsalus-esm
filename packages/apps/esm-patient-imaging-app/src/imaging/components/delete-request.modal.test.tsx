import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteRequestModal from './delete-request.modal';
import * as api from '../../api';
import { showSnackbar } from '@openmrs/esm-framework';
import { act } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('../../api');

jest.mock('@openmrs/esm-framework', () => ({
  showSnackbar: jest.fn(),
}));

describe('DeleteRequestModal', () => {
  const closeDeleteModal = jest.fn();
  const mutateMock = jest.fn();
  const requestId = 1;
  const patientUuid = 'patient-uuid-123';

  const setup = () => {
    (api.useRequestsByPatient as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
    render(<DeleteRequestModal closeDeleteModal={closeDeleteModal} requestId={requestId} patientUuid={patientUuid} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with confirmation text and buttons', () => {
    setup();
    expect(screen.getByText(/Delete requested procedure/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this requested procdure?/i)).toBeInTheDocument();

    // check buttons using role (avoids text collision)
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(closeDeleteModal).toHaveBeenCalled();
  });

  it('calls deleteRequest and shows success snackbar on success', async () => {
    (api.deleteRequest as jest.Mock).mockResolvedValueOnce({ ok: true });

    setup();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteRequest).toHaveBeenCalledWith(requestId, expect.any(AbortController));
      expect(mutateMock).toHaveBeenCalled();
      expect(closeDeleteModal).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          isLowContrast: true,
          kind: 'success',
          title: 'Request deleted',
        }),
      );
    });
  });

  it('shows error snackbar on delete failure', async () => {
    const errorMessage = 'An error occurred while deleting the requested procedure';
    (api.deleteRequest as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    setup();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.deleteRequest).toHaveBeenCalledWith(requestId, expect.any(AbortController));
      expect(mutateMock).not.toHaveBeenCalled();
      expect(closeDeleteModal).not.toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          isLowContrast: false,
          kind: 'error',
          title: 'An error occurred while deleting the requested procedure',
          subtitle: errorMessage,
        }),
      );
    });
  });

  it('shows loading state while deleting', async () => {
    let resolveDelete: ((val: any) => void) | undefined;

    (api.deleteRequest as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDelete = resolve; // capture resolver
        }),
    );

    setup();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(await screen.findByText(/Deleting/i)).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();

    await act(async () => {
      resolveDelete?.({ ok: true });
    });
  });
});
