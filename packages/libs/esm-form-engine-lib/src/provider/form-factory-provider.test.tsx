import { render } from '@testing-library/react';
import React, { useEffect } from 'react';

import { FormFactoryProvider, useFormFactory } from './form-factory-provider';

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string, defaultValue: string) => string } => ({
    t: (_key: string, defaultValue: string): string => defaultValue,
  }),
}));

jest.mock('@openmrs/esm-framework', () => ({
  showSnackbar: jest.fn(),
  useLayoutType: jest.fn(() => 'desktop'),
}));

jest.mock('../hooks/useExternalFormAction', () => ({
  useExternalFormAction: jest.fn(),
}));

jest.mock('../hooks/usePostSubmissionActions', () => ({
  usePostSubmissionActions: jest.fn(() => null),
}));

jest.mock('./form-factory-helper', () => ({
  processPostSubmissionActions: jest.fn(),
  validateForm: jest.fn(() => true),
}));

type RegisteredFormProps = {
  processSubmission: jest.Mock;
};

const RegisteredForm = ({ processSubmission }: RegisteredFormProps): React.JSX.Element => {
  const { registerForm } = useFormFactory();

  useEffect(() => {
    registerForm('root-form', false, {
      processor: {
        processSubmission,
      },
    } as never);
  }, [processSubmission, registerForm]);

  return null;
};

const baseProps = {
  patient: { id: 'patient-uuid' } as fhir.Patient,
  patientUUID: 'patient-uuid',
  sessionMode: 'enter' as const,
  sessionDate: new Date('2024-01-01T00:00:00.000Z'),
  formJson: { uuid: 'form-uuid', pages: [] } as never,
  workspaceLayout: 'maximized' as const,
  location: { uuid: 'location-uuid' } as never,
  provider: { uuid: 'provider-uuid' } as never,
  visit: { uuid: 'visit-uuid' } as never,
  isFormExpanded: true,
  hideFormCollapseToggle: jest.fn(),
  setIsFormDirty: jest.fn(),
};

describe('FormFactoryProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not abort or restart an active submission when rerendered', (): void => {
    const controllers: Array<AbortController> = [];
    const processSubmission = jest.fn((_formContext: unknown, abortController: AbortController): Promise<never> => {
      controllers.push(abortController);
      return new Promise(() => {});
    });

    const initialSubmitHandler = jest.fn();
    const nextSubmitHandler = jest.fn();
    const setIsSubmitting = jest.fn();

    const { rerender, unmount } = render(
      <FormFactoryProvider
        {...baseProps}
        formSubmissionProps={{
          isSubmitting: true,
          setIsSubmitting,
          onSubmit: initialSubmitHandler,
          onError: jest.fn(),
          handleClose: jest.fn(),
        }}
      >
        <RegisteredForm processSubmission={processSubmission} />
      </FormFactoryProvider>,
    );

    expect(processSubmission).toHaveBeenCalledTimes(1);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].signal.aborted).toBe(false);

    rerender(
      <FormFactoryProvider
        {...baseProps}
        formSubmissionProps={{
          isSubmitting: true,
          setIsSubmitting,
          onSubmit: nextSubmitHandler,
          onError: jest.fn(),
          handleClose: jest.fn(),
        }}
      >
        <RegisteredForm processSubmission={processSubmission} />
      </FormFactoryProvider>,
    );

    expect(processSubmission).toHaveBeenCalledTimes(1);
    expect(controllers[0].signal.aborted).toBe(false);

    unmount();

    expect(controllers[0].signal.aborted).toBe(true);
  });
});
