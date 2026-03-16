import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteSeriesModal from './delete-series.modal';
import * as api from '../../api';
import { showSnackbar } from '@openmrs/esm-framework';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('../../api');

jest.mock('@openmrs/esm-framework', () => ({
  showSnackbar: jest.fn(),
}));

describe('DeleteSeriesModal', () => {
  const closeDeleteModal = jest.fn();
  const mutateMock = jest.fn();
  const studyId = 1;
  const patientUuid = 'patient-uuid-123';

  const setup = () => {
    (api.useStudySeries as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
    render(
      <DeleteSeriesModal
        closeDeleteModal={closeDeleteModal}
        studyId={studyId}
        orthancSeriesUID="series-123"
        patientUuid={patientUuid}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with confirmation text and buttons', () => {
    setup();
    expect(screen.getByText('Delete study series')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this study series?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('closes modal when cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('Cancel'));
    expect(closeDeleteModal).toHaveBeenCalled();
  });

  it('calls deleteSeries and shows success snackbar on success', async () => {
    (api.deleteSeries as jest.Mock).mockResolvedValueOnce({ ok: true });
    (api.useStudySeries as jest.Mock).mockReturnValue({ mutate: mutateMock });

    setup();
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(api.deleteSeries).toHaveBeenCalledWith('series-123', 1, expect.any(AbortController));
      expect(mutateMock).toHaveBeenCalled();
      expect(closeDeleteModal).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(expect.objectContaining({ kind: 'success' }));
    });
  });

  it('shows error snackbar when delete fails', async () => {
    (api.deleteSeries as jest.Mock).mockRejectedValueOnce(
      new Error('An error occurred while deleting the study series'),
    );

    setup();
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'error',
          subtitle: 'An error occurred while deleting the study series',
        }),
      );
    });
  });

  it('disables delete button and shows loading while deleting', async () => {
    let resolveFn: (val: any) => void;
    (api.deleteSeries as jest.Mock).mockImplementationOnce(() => new Promise((resolve) => (resolveFn = resolve)));

    setup();
    fireEvent.click(screen.getByText('Delete'));

    // Delete button should now show inline loader
    expect(screen.getByText('Deleting...')).toBeInTheDocument();

    // The button may now be labeled differently (with loader)
    const deleteButton = screen.getByRole('button', { name: /deleting/i });
    expect(deleteButton).toBeDisabled();

    // Resolve the promise so the flow continues
    resolveFn!({ ok: true });

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith(expect.objectContaining({ kind: 'success' }));
    });
  });
});
