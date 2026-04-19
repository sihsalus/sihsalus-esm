import { getDefaultsFromConfigSchema, showModal, useConfig } from '@openmrs/esm-framework';
import { launchFormEntryOrHtmlForms, useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCurrentVisit, mockForms } from 'test-utils';
import React from 'react';
import { mockPatient } from 'test-utils';

import { configSchema, type ConfigObject } from '../config-schema';

import FormView from './form-view.component';

const mockLaunchFormEntryOrHtmlForms = launchFormEntryOrHtmlForms as jest.Mock;
const mockShowModal = jest.mocked(showModal);
const mockUseConfig = jest.mocked(useConfig<ConfigObject>);
const mockUseVisitOrOfflineVisit = useVisitOrOfflineVisit as jest.Mock;

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    launchFormEntryOrHtmlForms: jest.fn().mockImplementation((data) => {
      showModal(data);
    }),
    useVisitOrOfflineVisit: jest.fn(),
  };
});

mockUseConfig.mockReturnValue({
  ...getDefaultsFromConfigSchema(configSchema),
  htmlFormEntryForms: [],
});

describe('FormView', () => {
  test('should display `start-visit-dialog` when no visit has been started', async () => {
    const user = userEvent.setup();

    mockUseVisitOrOfflineVisit.mockReturnValueOnce({
      currentVisit: null,
    });

    render(
      <FormView
        patientUuid={mockPatient.uuid}
        forms={mockForms}
        pageSize={5}
        pageUrl={'/some-url'}
        patient={mockPatient}
        urlLabel="some-url-label"
      />,
    );

    const pocForm = await screen.findByText('POC COVID 19 Assessment Form v1.1');
    expect(pocForm).toBeInTheDocument();

    await user.click(pocForm);

    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });

  test('should launch form-entry patient-workspace window when visit is started', async () => {
    const user = userEvent.setup();

    mockUseVisitOrOfflineVisit.mockReturnValue({
      currentVisit: mockCurrentVisit,
      error: null,
    });

    render(
      <FormView
        patientUuid={mockPatient.uuid}
        forms={mockForms}
        pageSize={5}
        pageUrl={'/some-url'}
        patient={mockPatient}
        urlLabel="some-url-label"
      />,
    );

    const pocForm = await screen.findByText('POC COVID 19 Assessment Form v1.1');
    expect(pocForm).toBeInTheDocument();

    await user.click(pocForm);

    expect(mockLaunchFormEntryOrHtmlForms).toHaveBeenCalledWith(
      [],
      mockPatient.uuid,
      mockForms[0].form.uuid,
      mockCurrentVisit.uuid,
      undefined,
      mockForms[0].form.display,
      mockCurrentVisit.visitType.uuid,
      mockCurrentVisit.startDatetime,
      mockCurrentVisit.stopDatetime,
      undefined,
    );
  });

  test('should use the form uuid when launching edit mode from the last completed column', async () => {
    const user = userEvent.setup();

    mockUseVisitOrOfflineVisit.mockReturnValue({
      currentVisit: mockCurrentVisit,
      error: null,
    });

    const { container } = render(
      <FormView
        patientUuid={mockPatient.uuid}
        forms={mockForms}
        pageSize={5}
        pageUrl={'/some-url'}
        patient={mockPatient}
        urlLabel="some-url-label"
      />,
    );

    const lastCompletedLink = container.querySelectorAll('tbody label')[1];

    expect(lastCompletedLink).toBeInTheDocument();

    await user.click(lastCompletedLink);

    expect(mockLaunchFormEntryOrHtmlForms).toHaveBeenCalledWith(
      [],
      mockPatient.uuid,
      mockForms[0].form.uuid,
      mockCurrentVisit.uuid,
      mockForms[0].associatedEncounters[0].uuid,
      mockForms[0].form.display,
      mockCurrentVisit.visitType.uuid,
      mockCurrentVisit.startDatetime,
      mockCurrentVisit.stopDatetime,
      undefined,
    );
  });

  test('should use the form uuid when launching edit mode from the edit button', async () => {
    const user = userEvent.setup();

    mockUseVisitOrOfflineVisit.mockReturnValue({
      currentVisit: mockCurrentVisit,
      error: null,
    });

    render(
      <FormView
        patientUuid={mockPatient.uuid}
        forms={mockForms}
        pageSize={5}
        pageUrl={'/some-url'}
        patient={mockPatient}
        urlLabel="some-url-label"
      />,
    );

    const editButton = await screen.findByRole('button', { name: 'Edit form' });

    await user.click(editButton);

    expect(mockLaunchFormEntryOrHtmlForms).toHaveBeenCalledWith(
      [],
      mockPatient.uuid,
      mockForms[0].form.uuid,
      mockCurrentVisit.uuid,
      mockForms[0].associatedEncounters[0].uuid,
      mockForms[0].form.display,
      mockCurrentVisit.visitType.uuid,
      mockCurrentVisit.startDatetime,
      mockCurrentVisit.stopDatetime,
      undefined,
    );
  });
});
