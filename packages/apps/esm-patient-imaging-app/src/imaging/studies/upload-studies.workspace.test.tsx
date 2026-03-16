import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadStudiesWorkspace from './upload-studies.workspace';
import * as api from '../../api';
import * as framework from '@openmrs/esm-framework';
import { maxUploadImageDataSize } from '../constants';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, fallback: string) => fallback }),
}));

jest.mock('../../api', () => ({
  uploadStudies: jest.fn(),
  useOrthancConfigurations: jest.fn(),
}));

jest.mock('@openmrs/esm-framework', () => ({
  showSnackbar: jest.fn(),
  createErrorHandler: jest.fn(),
  useLayoutType: jest.fn(),
  ExtensionSlot: () => <div>ExtensionSlot</div>,
  ResponsiveWrapper: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@carbon/react', () => {
  const original = jest.requireActual('@carbon/react');
  return {
    ...original,
    ComboBox: ({ onChange, selectedItem }: any) => (
      <select
        data-testid="combobox"
        value={selectedItem?.id || ''}
        onChange={(e) => onChange({ selectedItem: { id: Number(e.target.value), orthancBaseUrl: e.target.value } })}
      >
        <option value="">Select</option>
        <option value="1">Server 1</option>
        <option value="2">Server 2</option>
      </select>
    ),
    FileUploader: ({ onChange }: any) => <input type="file" data-testid="file-uploader" onChange={onChange} multiple />,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    Stack: ({ children }: any) => <div>{children}</div>,
    Row: ({ children }: any) => <div>{children}</div>,
    FormGroup: ({ children }: any) => <div>{children}</div>,
  };
});

describe('UploadStudiesWorkspace', () => {
  const patientUuid = 'patient-123';
  const closeWorkspace = jest.fn();

  beforeEach(() => {
    (api.useOrthancConfigurations as jest.Mock).mockReturnValue({
      data: [
        { id: 1, orthancBaseUrl: 'url1', orthancProxyUrl: null },
        { id: 2, orthancBaseUrl: 'url2', orthancProxyUrl: null },
      ],
    });
    (framework.useLayoutType as jest.Mock).mockReturnValue('desktop');
    jest.clearAllMocks();
  });

  const setup = () => {
    render(
      <UploadStudiesWorkspace
        patientUuid={patientUuid}
        closeWorkspace={closeWorkspace}
        patient={undefined}
        promptBeforeClosing={jest.fn()}
        closeWorkspaceWithSavedChanges={jest.fn()}
        setTitle={jest.fn()}
      />,
    );
  };

  it('renders form elements correctly', () => {
    setup();

    expect(screen.getByTestId('combobox')).toBeInTheDocument();
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows error snackbar if no files are selected', async () => {
    setup();

    // Select a valid Orthanc server to pass form validation
    fireEvent.change(screen.getByTestId('combobox'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() =>
      expect(framework.showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({ subtitle: 'Select files to upload' }),
      ),
    );
  });

  it('shows error if file size exceeds limit', async () => {
    setup();

    const file = new File([new ArrayBuffer(maxUploadImageDataSize + 1)], 'bigfile.dcm', {
      type: 'application/dicom',
    });

    fireEvent.change(screen.getByTestId('file-uploader'), { target: { files: [file] } });
    fireEvent.change(screen.getByTestId('combobox'), { target: { value: '1' } });
    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() =>
      expect(framework.showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          subtitle: expect.stringContaining(`${maxUploadImageDataSize / 1000000} MB`),
        }),
      ),
    );
  });

  it('calls uploadStudies and closes workspace on successful upload', async () => {
    const file = new File(['dummy content'], 'test.dcm', { type: 'application/dicom' });
    (api.uploadStudies as jest.Mock).mockResolvedValue({});

    setup();

    fireEvent.change(screen.getByTestId('file-uploader'), { target: { files: [file] } });
    fireEvent.change(screen.getByTestId('combobox'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() => {
      expect(api.uploadStudies).toHaveBeenCalled();
      expect(closeWorkspace).toHaveBeenCalled();
    });
  });

  it('shows snackbar on upload failure', async () => {
    const file = new File(['dummy content'], 'test.dcm', { type: 'application/dicom' });
    (api.uploadStudies as jest.Mock).mockRejectedValue(new Error('Upload failed'));

    setup();

    fireEvent.change(screen.getByTestId('file-uploader'), { target: { files: [file] } });
    fireEvent.change(screen.getByTestId('combobox'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() => {
      expect(framework.showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({ subtitle: expect.stringContaining('Upload failed') }),
      );
    });
  });

  it('calls closeWorkspace when Cancel button is clicked', () => {
    setup();

    fireEvent.click(screen.getByText('Cancel'));
    expect(closeWorkspace).toHaveBeenCalled();
  });
});
