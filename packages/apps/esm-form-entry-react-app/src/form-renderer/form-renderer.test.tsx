import { act, render, screen } from '@testing-library/react';
import React from 'react';

import FormRenderer from './form-renderer.component';

// Mock dependencies
jest.mock('@openmrs/esm-framework', () => ({
  showModal: jest.fn(() => jest.fn()),
  useConfig: jest.fn(() => ({
    dataSources: { monthlySchedule: false },
    customDataSources: [],
    appointmentsResourceUrl: '/etl-latest/etl/get-monthly-schedule',
    customEncounterDatetime: false,
  })),
  openmrsFetch: jest.fn(),
  restBaseUrl: '/ws/rest/v1',
  getGlobalStore: jest.fn(() => ({
    getState: () => ({}),
    setState: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
  createGlobalStore: jest.fn(() => ({
    getState: () => ({}),
    setState: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
  showSnackbar: jest.fn(),
}));

jest.mock('@sihsalus/esm-form-engine-lib', () => ({
  FormEngine: jest.fn(() => <div data-testid="form-engine">FormEngine Mock</div>),
}));

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  clinicalFormsWorkspace: 'clinical-forms-workspace',
  launchPatientWorkspace: jest.fn(),
}));

jest.mock('../hooks/useFormSchema', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../hooks/useCustomDataSources', () => ({
  useCustomDataSources: jest.fn(),
}));

const mockShowLabOrdersNotification = jest.fn();

jest.mock('../hooks/useLabOrderNotification', () => ({
  useLabOrderNotification: jest.fn(() => ({ showLabOrdersNotification: mockShowLabOrdersNotification })),
}));

jest.mock('../hooks/useCustomEncounterDatetime', () => ({
  useCustomEncounterDatetime: jest.fn((_, __, preFilled) => preFilled),
}));

import useFormSchema from '../hooks/useFormSchema';

const mockUseFormSchema = jest.mocked(useFormSchema);

const defaultProps = {
  formUuid: 'test-form-uuid',
  patientUuid: 'test-patient-uuid',
  patient: {} as fhir.Patient,
  view: 'form',
  visitUuid: 'test-visit-uuid',
  visitStartDatetime: '2024-01-01T08:00:00.000+0000',
  visitStopDatetime: '2024-01-01T18:00:00.000+0000',
  isOffline: false,
  closeWorkspace: jest.fn(),
  closeWorkspaceWithSavedChanges: jest.fn(),
  promptBeforeClosing: jest.fn(),
  setTitle: jest.fn(),
};

const canonicalProps = {
  formUuid: 'test-form-uuid',
  patientUuid: 'test-patient-uuid',
  patient: {} as fhir.Patient,
  visit: {
    uuid: 'test-visit-uuid',
    startDatetime: '2024-01-01T08:00:00.000+0000',
    stopDatetime: '2024-01-01T18:00:00.000+0000',
    encounters: [],
    visitType: { uuid: 'visit-type-123', display: 'Visit type' },
  },
  closeWorkspace: jest.fn(),
  closeWorkspaceWithSavedChanges: jest.fn(),
  setHasUnsavedChanges: jest.fn(),
};

describe('FormRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowLabOrdersNotification.mockReset();
  });

  it('renders loading state', () => {
    mockUseFormSchema.mockReturnValue({ schema: undefined, error: undefined, isLoading: true });
    render(<FormRenderer {...defaultProps} />);
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseFormSchema.mockReturnValue({ schema: undefined, error: new Error('fail'), isLoading: false });
    render(<FormRenderer {...defaultProps} />);
    expect(screen.getByText(/there was an error with this form/i)).toBeInTheDocument();
  });

  it('renders FormEngine when schema is loaded', () => {
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });
    render(<FormRenderer {...defaultProps} />);
    expect(screen.getByTestId('form-engine')).toBeInTheDocument();
  });

  it('passes encounterUUID for edit mode', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...defaultProps} encounterUuid="enc-123" />);
    expect(FormEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        encounterUUID: 'enc-123',
        mode: 'edit',
      }),
      expect.anything(),
    );
  });

  it('defaults to enter mode when no encounterUuid', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...defaultProps} />);
    expect(FormEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'enter',
      }),
      expect.anything(),
    );
  });

  it('constructs visit object from string props', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...defaultProps} visitTypeUuid="visit-type-123" />);
    expect(FormEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        visit: expect.objectContaining({
          uuid: 'test-visit-uuid',
          startDatetime: '2024-01-01T08:00:00.000+0000',
          stopDatetime: '2024-01-01T18:00:00.000+0000',
          visitType: { uuid: 'visit-type-123', display: '' },
        }),
      }),
      expect.anything(),
    );
  });

  it('uses the canonical visit object when provided by a v12-style caller', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...canonicalProps} />);

    expect(FormEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        visit: canonicalProps.visit,
      }),
      expect.anything(),
    );
  });

  it('allows canonical callers to omit visit context', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...canonicalProps} visit={undefined} />);

    expect(FormEngine).toHaveBeenCalledWith(
      expect.objectContaining({
        visit: undefined,
      }),
      expect.anything(),
    );
  });

  it('bridges dirty state through promptBeforeClosing for legacy callers', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...defaultProps} />);
    const formEngineProps = (FormEngine as jest.Mock).mock.calls[0][0];

    formEngineProps.markFormAsDirty(true);

    expect(defaultProps.promptBeforeClosing).toHaveBeenCalledWith(expect.any(Function));
    expect(defaultProps.promptBeforeClosing.mock.calls[0][0]()).toBe(true);
  });

  it('uses setHasUnsavedChanges directly for canonical callers', () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...canonicalProps} />);
    const formEngineProps = (FormEngine as jest.Mock).mock.calls[0][0];

    formEngineProps.markFormAsDirty(true);

    expect(canonicalProps.setHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it('shows lab order notifications and closes the workspace after a successful submit', async () => {
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');
    const handlePostResponse = jest.fn();
    mockUseFormSchema.mockReturnValue({
      schema: { uuid: 'test', name: 'Test Form', encounterType: 'enc-type-uuid' } as any,
      error: undefined,
      isLoading: false,
    });

    render(<FormRenderer {...defaultProps} handlePostResponse={handlePostResponse} />);
    const formEngineProps = (FormEngine as jest.Mock).mock.calls[0][0];
    const submittedEncounter = { uuid: 'encounter-123' };

    await act(async () => {
      await formEngineProps.onSubmit([submittedEncounter]);
    });

    expect(mockShowLabOrdersNotification).toHaveBeenCalledWith('encounter-123');
    expect(handlePostResponse).toHaveBeenCalledWith(submittedEncounter);
    expect(defaultProps.closeWorkspaceWithSavedChanges).toHaveBeenCalled();
  });
});
