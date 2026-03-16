import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddNewProcedureStepWorkspace, { AddNewProcedureStepWorkspaceProps } from './add-procedureStep-form.workspace';
import * as api from '../../api';
import { RequestProcedure } from '../../types';
import userEvent from '@testing-library/user-event';

jest.mock('../../api');
jest.mock('@openmrs/esm-framework', () => ({
  OpenmrsDatePicker: React.forwardRef(({ id, onChange, ...props }: any, ref) => (
    <input ref={ref} data-testid={id} type="date" onChange={(e) => onChange?.(new Date(e.target.value))} {...props} />
  )),
  ResponsiveWrapper: ({ children }: any) => <div>{children}</div>,
  useLayoutType: jest.fn(() => 'desktop'),
  showSnackbar: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

jest.mock('@carbon/react', () => {
  const original = jest.requireActual('@carbon/react');
  return {
    ...original,
    ComboBox: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    TimePicker: ({ labelText, children, ...props }: any) => (
      <label>
        {labelText}
        <input data-testid="timePickerInput" {...props} />
        {children}
      </label>
    ),
    TimePickerSelect: ({ children, ...props }: any) => <select {...props}>{children}</select>,
    SelectItem: (props: any) => <option {...props} />,
    Button: (props: any) => <button {...props}>{props.children}</button>,
    ButtonSet: ({ children }: any) => <div>{children}</div>,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    FormGroup: ({ children }: any) => <div>{children}</div>,
    Stack: ({ children }: any) => <div>{children}</div>,
    InlineLoading: (props: any) => <span>{props.description}</span>,
    TextInput: ({ labelText, ...props }: any) => (
      <label>
        {labelText}
        <input {...props} />
      </label>
    ),
    TextArea: ({ labelText, ...props }: any) => (
      <label>
        {labelText}
        <textarea {...props} />
      </label>
    ),
  };
});

const orthancConfigMock = [{ id: 1, orthancBaseUrl: 'http://orthanc.local' }];
const patientUuid = 'patient-123';

const mockRequest: RequestProcedure = {
  id: 1,
  status: 'scheduled',
  orthancConfiguration: orthancConfigMock[0],
  patientUuid: patientUuid,
  accessionNumber: 'access-123',
  requestingPhysician: 'Dr Smith',
  requestDescription: 'Head CT',
  priority: 'High',
};

const defaultProps: AddNewProcedureStepWorkspaceProps = {
  patientUuid: patientUuid,
  request: mockRequest,
  closeWorkspace: jest.fn(),
  closeWorkspaceWithSavedChanges: jest.fn(),
  promptBeforeClosing: jest.fn(),
  patient: undefined,
  setTitle: function (title: string, titleNode?: React.ReactNode): void {
    throw new Error('Function not implemented.');
  },
};

describe('AddNewProcedureStepWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.useProcedureStep as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (api.useRequestsByPatient as jest.Mock).mockReturnValue({ mutate: jest.fn() });
  });
  const setup = () => {
    render(<AddNewProcedureStepWorkspace {...defaultProps} />);
  };

  it('renders form fields correctly', () => {
    setup();

    expect(screen.getByLabelText('Modality')).toBeInTheDocument();
    expect(screen.getByLabelText('AetTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('scheduledReferringPhysician')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByTestId('stepStartDate')).toBeInTheDocument();
    expect(screen.getByText('Start time')).toBeInTheDocument();
    expect(screen.getByLabelText('stationName')).toBeInTheDocument();
    expect(screen.getByLabelText('procedureStepLocation')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AddNewProcedureStepWorkspace {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /save and close/i }));

    await waitFor(() => {
      const scheduledReferringPhysician = screen.getByLabelText(/scheduledReferringPhysician/i);
      expect(scheduledReferringPhysician).toHaveAttribute('invalidtext', 'Scheduled referring physician is required');
    });

    await waitFor(() => {
      const description = screen.getByLabelText(/description/i);
      expect(description).toHaveAttribute('invalidtext', 'Description is required');
    });

    await waitFor(() => {
      const time = screen.getByTestId(/stepStartTime/i);
      expect(time).toHaveAttribute('invalidtext', expect.stringMatching(/required/i));
    });

    await waitFor(() => {
      const modality = screen.getByLabelText(/modality/i);
      expect(modality).toHaveAttribute('invalidtext', 'Modality is required');
      expect(screen.getByLabelText(/AetTitle/i)).toHaveAttribute('invalidtext', 'Required');
    });
  });

  it('submits form with correct payload', async () => {
    (api.saveRequestProcedureStep as jest.Mock).mockResolvedValue({});

    render(<AddNewProcedureStepWorkspace {...defaultProps} />);
    const user = userEvent.setup();

    // Fill required fields
    await user.type(screen.getByLabelText(/AetTitle/i), 'Test AET');
    await user.type(screen.getByLabelText(/scheduledReferringPhysician/i), 'Dr. Smith');
    await user.type(screen.getByLabelText(/Description/i), 'Test procedure');

    // Mocked OpenmrsDatePicker -> returns a Date
    fireEvent.change(screen.getByTestId('stepStartDate'), {
      target: { value: '2025-09-04' },
    });

    await user.type(screen.getByLabelText(/Start time/i), '10:30');
    await user.selectOptions(screen.getByLabelText(/Time Format/i), 'AM');

    const comboBox = screen.getByTestId(/modality/i);
    await user.click(comboBox);

    const option = await screen.findByText(/CR/i);
    await user.click(option);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Save and Close/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.saveRequestProcedureStep).toHaveBeenCalledTimes(1);
      expect(defaultProps.closeWorkspaceWithSavedChanges).toHaveBeenCalledTimes(1);
    });
  });

  it('calls promptBeforeClosing when form is dirty', async () => {
    render(<AddNewProcedureStepWorkspace {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/AetTitle/i), { target: { value: 'Changed' } });

    await waitFor(() => {
      expect(defaultProps.promptBeforeClosing).toHaveBeenCalled();
    });
  });

  it('disables submit button when submitting', async () => {
    (api.saveRequestProcedureStep as jest.Mock).mockResolvedValue({});

    render(<AddNewProcedureStepWorkspace {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/AetTitle/i), { target: { value: 'Test AET' } });
    fireEvent.change(screen.getByLabelText(/scheduledReferringPhysician/i), { target: { value: 'Dr. Smith' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test procedure' } });
    fireEvent.change(screen.getByTestId('stepStartDate'), { target: { value: '2025-09-04' } });
    fireEvent.change(screen.getByLabelText(/Start time/i), { target: { value: '10:30' } });

    const submitButton = screen.getByRole('button', { name: /Save and Close/i });
    fireEvent.click(screen.getByText(/Save and Close/i));
    expect(submitButton).toBeDisabled();
  });
});
