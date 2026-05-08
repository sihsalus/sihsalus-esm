import { render, screen } from '@testing-library/react';
import React from 'react';

import useFormSchema from '../hooks/useFormSchema';

import FormRenderer from './form-renderer.component';

const mockUseFormSchema = jest.mocked(useFormSchema);

jest.mock(
  '@sihsalus/esm-form-engine-lib',
  () => ({
    FormEngine: jest
      .fn()
      .mockImplementation(() => React.createElement('div', { 'data-testid': 'openmrs form' }, 'FORM ENGINE LIB')),
  }),
  { virtual: true },
);

jest.mock('../hooks/useFormSchema', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('FormRenderer', () => {
  const defaultProps = {
    formUuid: 'test-form-uuid',
    patientUuid: 'test-patient-uuid',
    patient: { id: 'test-patient-uuid' } as fhir.Patient,
    closeWorkspace: jest.fn(),
    closeWorkspaceWithSavedChanges: jest.fn(),
    promptBeforeClosing: jest.fn(),
    setTitle: jest.fn(),
  };

  test('renders FormError component when there is an error', () => {
    mockUseFormSchema.mockReturnValue({ schema: null, isLoading: false, error: new Error('test error') });

    render(<FormRenderer {...defaultProps} />);

    expect(screen.getByText(/There was an error with this form/i)).toBeInTheDocument();
  });

  test('renders InlineLoading component when loading', () => {
    mockUseFormSchema.mockReturnValue({ schema: null, isLoading: true, error: null });

    render(<FormRenderer {...defaultProps} />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  test('renders a form preview from the engine when a schema is available', async () => {
    mockUseFormSchema.mockReturnValue({ schema: { uuid: 'test-schema' }, isLoading: false, error: null } as ReturnType<
      typeof useFormSchema
    >);

    render(<FormRenderer {...defaultProps} />);
    expect(await screen.findByText(/form engine lib/i)).toBeInTheDocument();
    expect(mockUseFormSchema).toHaveBeenCalledWith('test-form-uuid');
  });

  test('fallback submit closes only the current workspace', async () => {
    const closeWorkspace = jest.fn();
    const handlePostResponse = jest.fn();
    const { FormEngine } = jest.requireMock('@sihsalus/esm-form-engine-lib');

    mockUseFormSchema.mockReturnValue({ schema: { uuid: 'test-schema' }, isLoading: false, error: null } as ReturnType<
      typeof useFormSchema
    >);

    render(
      <FormRenderer
        {...defaultProps}
        closeWorkspace={closeWorkspace}
        closeWorkspaceWithSavedChanges={undefined}
        handlePostResponse={handlePostResponse}
      />,
    );

    FormEngine.mock.calls.at(-1)[0].onSubmit([{ uuid: 'submitted-encounter-uuid' }]);

    expect(closeWorkspace).toHaveBeenCalledWith({ ignoreChanges: true, closeWorkspaceGroup: false });
    expect(handlePostResponse).toHaveBeenCalledWith({ uuid: 'submitted-encounter-uuid' });
  });
});
