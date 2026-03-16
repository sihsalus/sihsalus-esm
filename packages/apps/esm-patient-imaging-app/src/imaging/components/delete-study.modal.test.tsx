import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteStudyModal from './delete-study.modal';
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

describe('DeleteStudyModal', () => {
  const closeDeleteModal = jest.fn();
  const mutateMock = jest.fn();
  const patientUuid = 'patient-uuid-123';
  const studyId = 42;

  beforeEach(() => {
    jest.clearAllMocks();
    (api.useStudiesByPatient as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
  });

  it('renders modal with default selected radio button', () => {
    render(<DeleteStudyModal closeDeleteModal={closeDeleteModal} studyId={studyId} patientUuid={patientUuid} />);

    expect(screen.getByText(/Delete the image study/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this study?/i)).toBeInTheDocument();
    const openmrsRadio = screen.getByLabelText(/From OpenMRS/i) as HTMLInputElement;
    const bothRadio = screen.getByLabelText(/From Orthanc & OpenMRS/i) as HTMLInputElement;

    expect(openmrsRadio.checked).toBe(true);
    expect(bothRadio.checked).toBe(false);
  });

  it('Calls deleteStudy, mutate, close modal and shows success snackbar on delete', async () => {
    (api.deleteStudy as jest.Mock).mockResolvedValue({ ok: true });

    render(<DeleteStudyModal closeDeleteModal={closeDeleteModal} studyId={studyId} patientUuid={patientUuid} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(api.deleteStudy).toHaveBeenCalledWith(studyId, 'openmrs', expect.any(AbortController));
      expect(mutateMock).toHaveBeenCalled();
      expect(closeDeleteModal).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          isLowContrast: true,
          kind: 'success',
          title: 'Study is deleted',
        }),
      );
    });
  });

  it('shows error snackbar on delete failure', async () => {
    const errorMessage = 'Something went wrong';
    (api.deleteStudy as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<DeleteStudyModal closeDeleteModal={closeDeleteModal} studyId={studyId} patientUuid={patientUuid} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          isLowContrast: false,
          kind: 'error',
          title: 'An error occurred while deleting the study',
          subtitle: errorMessage,
        }),
      );
    });
    expect(closeDeleteModal).not.toHaveBeenCalled();
  });

  it('updates selectedOption when radio button is changed', async () => {
    render(<DeleteStudyModal closeDeleteModal={closeDeleteModal} studyId={studyId} patientUuid={patientUuid} />);
    const bothRadio = screen.getByLabelText(/From Orthanc & OpenMRS/i) as HTMLInputElement;
    fireEvent.click(bothRadio);
    expect(bothRadio.checked).toBe(true);
  });
});
