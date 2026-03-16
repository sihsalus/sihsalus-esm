import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import InstancePreviewModal from './instance-preview.modal';
import '@testing-library/jest-dom';
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

describe('InstancePreviewModal', () => {
  const closeMock = jest.fn();
  const defaultProps = {
    closeInstancePreviewModal: closeMock,
    studyId: 1,
    orthancInstanceUID: 'UID123',
    instancePosition: '1 of 10',
  };

  const setup = () => render(<InstancePreviewModal {...defaultProps} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  });

  afterAll(() => {
    (global.URL.createObjectURL as jest.Mock).mockRestore?.();
  });

  it('renders loading state initially', async () => {
    (api.previewInstance as jest.Mock).mockReturnValue(new Promise(() => {}));

    await act(async () => {
      setup();
    });

    expect(screen.getByText(/Loading image/i)).toBeInTheDocument();
    expect(screen.getByText(/Instance position: 1 of 10/i)).toBeInTheDocument();
  });

  it('renders image after successful fetch', async () => {
    const blob = new Blob(['fake image'], { type: 'image/png' });

    const response = { blob: jest.fn().mockResolvedValue(blob) };
    (api.previewInstance as jest.Mock).mockResolvedValue(response);

    setup();

    await waitFor(() => {
      const img = screen.getByRole('img', { hidden: true }) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect((img as HTMLImageElement).src).toContain('blob:mock-url');
    });
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch');
    (api.previewInstance as jest.Mock).mockImplementation(() => Promise.reject(error));

    setup();

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'error',
          title: 'An error occurred while retrieving the instance preview',
          subtitle: 'Failed to fetch',
        }),
      );
      expect(closeMock).toHaveBeenCalled();
    });
  });

  it('renders and finishes loading', async () => {
    const blob = new Blob(['fake image'], { type: 'image/png' });
    const response = { blob: jest.fn().mockResolvedValue(blob) };
    (api.previewInstance as jest.Mock).mockResolvedValue(response);

    setup();

    // wait for the imageData update
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain('blob:mock-url');
    });
  });
});
