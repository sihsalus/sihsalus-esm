import {
  ExtensionSlot,
  type FetchResponse,
  getDefaultsFromConfigSchema,
  saveVisit,
  showSnackbar,
  updateVisit,
  useConfig,
  useLocations,
  usePatient,
  useVisitTypes,
  type Visit,
} from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocations, mockVisitTypes, mockVisitWithAttributes } from '__mocks__';
import dayjs from 'dayjs';
import React from 'react';
import { mockPatient } from 'test-utils';

import { type ChartConfig, esmPatientChartSchema } from '../../config-schema';
import { useEmrConfiguration } from '../hooks/useEmrConfiguration';
import { useVisitAttributeType } from '../hooks/useVisitAttributeType';

import {
  createVisitAttribute,
  deleteVisitAttribute,
  updateVisitAttribute,
  useVisitFormCallbacks,
} from './visit-form.resource';
import StartVisitForm from './visit-form.workspace';

jest.mock('@carbon/react', () => {
  const actual = jest.requireActual('@carbon/react');
  const React = jest.requireActual('react');
  const dayjs = jest.requireActual('dayjs');

  const MockDatePickerInput = React.forwardRef(function MockDatePickerInput(
    { id, labelText, invalid, invalidText, placeholder, style, value, onChange, ...props },
    ref,
  ) {
    return (
      <>
        <label htmlFor={id}>{labelText}</label>
        <input
          {...props}
          aria-invalid={invalid}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          style={style}
          type="text"
          value={value ?? ''}
        />
        {invalid ? <span>{invalidText}</span> : null}
      </>
    );
  });

  return {
    ...actual,
    ComboBox: ({ 'aria-label': ariaLabel, id, items, itemToString, onChange, selectedItem, titleText }) => {
      const selectedValue = selectedItem?.uuid ?? items[0]?.uuid ?? '';

      return (
        <>
          <label htmlFor={id}>{titleText}</label>
          <select
            aria-label={ariaLabel ?? titleText}
            id={id}
            onChange={(event) => {
              const nextValue = event.target.value;
              onChange?.({
                selectedItem: items.find((item) => item?.uuid === nextValue) ?? null,
              });
            }}
            value={selectedValue}
          >
            <option value="" />
            {items.map((item) => (
              <option key={item.uuid} value={item.uuid}>
                {itemToString(item)}
              </option>
            ))}
          </select>
        </>
      );
    },
    DatePicker: ({ children, onChange, value }) => {
      const child = React.Children.only(children);
      const formattedValue = value ? dayjs(value).format('DD/MM/YYYY') : '';

      return React.cloneElement(child, {
        onChange: (event) => {
          child.props.onChange?.(event);
          const parsedDate = dayjs(event.target.value, 'DD/MM/YYYY', true);
          onChange?.([parsedDate.isValid() ? parsedDate.toDate() : undefined]);
        },
        value: formattedValue,
      });
    },
    DatePickerInput: MockDatePickerInput,
  };
});

const visitUuid = 'test_visit_uuid';
const visitAttributes = {
  punctuality: {
    uuid: '57ea0cbb-064f-4d09-8cf4-e8228700491c',
    name: 'Punctuality',
    display: 'Punctuality',
    datatypeClassname: 'org.openmrs.customdatatype.datatype.ConceptDatatype' as const,
    datatypeConfig: '',
    preferredHandlerClassname: 'default',
    description: '',
    retired: false,
  },
  insurancePolicyNumber: {
    uuid: 'aac48226-d143-4274-80e0-264db4e368ee',
    name: 'Insurance Policy Number',
    display: 'Insurance Policy Number',
    datatypeConfig: '',
    datatypeClassname: 'org.openmrs.customdatatype.datatype.FreeTextDatatype',
    description: '',
    preferredHandlerClassname: 'default',
    retired: false,
  },
};

const mockCloseWorkspace = jest.fn();
const mockPromptBeforeClosing = jest.fn();
const mockSetTitle = jest.fn();

const testProps = {
  openedFrom: 'test',
  patientUuid: mockPatient.id,
  closeWorkspace: mockCloseWorkspace,
  closeWorkspaceWithSavedChanges: mockCloseWorkspace,
  promptBeforeClosing: mockPromptBeforeClosing,
  showVisitEndDateTimeFields: false,
  setTitle: mockSetTitle,
};

const mockSaveVisit = jest.mocked(saveVisit);
const mockUpdateVisit = jest.mocked(updateVisit);
const mockExtensionSlot = jest.mocked(ExtensionSlot);
const mockUseConfig = jest.mocked(useConfig<ChartConfig>);
const mockUseVisitAttributeType = jest.mocked(useVisitAttributeType);
const mockUseVisitTypes = jest.mocked(useVisitTypes);
const mockUsePatient = jest.mocked(usePatient);
const mockUseLocations = jest.mocked(useLocations);
const mockUseEmrConfiguration = jest.mocked(useEmrConfiguration);

// from ./visit-form.resource
const mockOnVisitCreatedOrUpdatedCallback = jest.fn();
jest.mocked(useVisitFormCallbacks).mockReturnValue([
  new Map([['test-extension-id', { onVisitCreatedOrUpdated: mockOnVisitCreatedOrUpdatedCallback }]]), // visitFormCallbacks
  jest.fn(), // setVisitFormCallbacks
]);
const mockCreateVisitAttribute = jest.mocked(createVisitAttribute).mockResolvedValue({} as unknown as FetchResponse);
const mockUpdateVisitAttribute = jest.mocked(updateVisitAttribute).mockResolvedValue({} as unknown as FetchResponse);
const mockDeleteVisitAttribute = jest.mocked(deleteVisitAttribute).mockResolvedValue({} as unknown as FetchResponse);

jest.mock('@openmrs/esm-patient-common-lib', () => ({
  ...jest.requireActual('@openmrs/esm-patient-common-lib'),
  useActivePatientEnrollment: jest.fn().mockReturnValue({
    activePatientEnrollment: [],
    isLoading: false,
  }),
}));

jest.mock('../hooks/useVisitAttributeType', () => ({
  useVisitAttributeType: jest.fn((attributeUuid) => {
    if (attributeUuid === visitAttributes.punctuality.uuid) {
      return {
        isLoading: false,
        error: null,
        data: visitAttributes.punctuality,
      };
    }
    if (attributeUuid === visitAttributes.insurancePolicyNumber.uuid) {
      return {
        isLoading: false,
        error: null,
        data: visitAttributes.insurancePolicyNumber,
      };
    }
  }),
  useVisitAttributeTypes: jest.fn(() => ({
    isLoading: false,
    error: null,
    visitAttributeTypes: [visitAttributes.punctuality, visitAttributes.insurancePolicyNumber],
  })),
  useConceptAnswersForVisitAttributeType: jest.fn(() => ({
    isLoading: false,
    error: null,
    answers: [
      {
        uuid: '66cdc0a1-aa19-4676-af51-80f66d78d9eb',
        display: 'On time',
        links: [
          {
            rel: 'self',
            uri: 'http://localhost:8080/openmrs/ws/rest/v1/concept/66cdc0a1-aa19-4676-af51-80f66d78d9eb',
            resourceAlias: 'concept',
          },
        ],
      },
      {
        uuid: '66cdc0a1-aa19-4676-af51-80f66d78d9ec',
        display: 'Late',
        links: [
          {
            rel: 'self',
            uri: 'http://localhost:8080/openmrs/ws/rest/v1/concept/66cdc0a1-aa19-4676-af51-80f66d78d9ec',
            resourceAlias: 'concept',
          },
        ],
      },
    ],
  })),
}));

jest.mock('../hooks/useEmrConfiguration', () => ({
  useEmrConfiguration: jest.fn(() => ({})),
}));

jest.mock('../hooks/useDefaultFacilityLocation', () => {
  const requireActual = jest.requireActual('../hooks/useDefaultFacilityLocation');

  return {
    ...requireActual,
    useDefaultLoginLocation: jest.fn(() => ({
      defaultFacility: null,
      isLoading: false,
    })),
  };
});

jest.mock('./visit-form.resource', () => {
  const requireActual = jest.requireActual('./visit-form.resource');
  return {
    ...requireActual,
    useVisitFormCallbacks: jest.fn(),
    createVisitAttribute: jest.fn(),
    updateVisitAttribute: jest.fn(),
    deleteVisitAttribute: jest.fn(),
  };
});

mockSaveVisit.mockResolvedValue({
  status: 201,
  data: {
    uuid: visitUuid,
    visitType: {
      display: 'Facility Visit',
    },
  },
} as unknown as FetchResponse<Visit>);

describe('Visit form', () => {
  beforeEach(() => {
    mockExtensionSlot.mockImplementation(({ children }) => {
      if (typeof children === 'function') {
        return children({
          id: 'test-extension-id',
          meta: {},
          moduleName: '@openmrs/esm-patient-chart-app',
        });
      }

      return children ?? null;
    });
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(esmPatientChartSchema),
      visitAttributeTypes: [
        {
          uuid: visitAttributes.punctuality.uuid,
          required: false,
          displayInThePatientBanner: true,
        },
        {
          uuid: visitAttributes.insurancePolicyNumber.uuid,
          required: false,
          displayInThePatientBanner: true,
        },
      ],
    });
    mockUsePatient.mockReturnValue({
      error: null,
      isLoading: false,
      patient: mockPatient,
      patientUuid: mockPatient.id,
    });
    mockUseVisitTypes.mockReturnValue(mockVisitTypes);
    mockUseLocations.mockReturnValue(mockLocations.data.results);
    mockUseEmrConfiguration.mockReturnValue({
      emrConfiguration: {
        atFacilityVisitType: null,
      },
      isLoadingEmrConfiguration: false,
      errorFetchingEmrConfiguration: null,
      mutateEmrConfiguration: null,
    });
  });

  it('renders the Start Visit form with all the relevant fields and values', async () => {
    renderVisitForm();

    expect(screen.getByRole('textbox', { name: /Date/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Time/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Time/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Select a location/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /HIV Return Visit/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /AM/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /PM/i })).toBeInTheDocument();
    expect(screen.getByText(/Punctuality/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Start Visit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Discard/i })).toBeInTheDocument();

    // Testing the location picker
    const combobox = screen.getByRole('combobox', { name: /Select a location/i });
    expect(screen.getByText(/Outpatient Visit/i)).toBeInTheDocument();
    expect(combobox).toHaveDisplayValue('Mosoriot');
    expect(screen.getByRole('option', { name: /Mosoriot/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Inpatient Ward/i })).toBeInTheDocument();
  });

  it('does not render visit type combo box if atFacilityVisitType set', async () => {
    mockUseEmrConfiguration.mockReturnValue({
      emrConfiguration: {
        atFacilityVisitType: {
          uuid: 'some-uuid1',
        },
      },
      isLoadingEmrConfiguration: false,
      errorFetchingEmrConfiguration: null,
      mutateEmrConfiguration: null,
    });
    renderVisitForm();
    expect(screen.queryByRole('radio', { name: /HIV Return Visit/ })).not.toBeInTheDocument();
  });

  it('renders a validation error when required fields are not filled', async () => {
    const user = userEvent.setup();

    renderVisitForm();

    const saveButton = screen.getByRole('button', { name: /start visit/i });
    const locationPicker = screen.getByRole('combobox', { name: /select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');
    await user.click(saveButton);

    expect(screen.getByText(/missing visit type/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a visit type/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/Outpatient visit/i));
  });

  // TODO: Figure out why this test is failing
  xit('displays an error message when the visit start time is in the future', async () => {
    const user = userEvent.setup();

    renderVisitForm();

    const dateInput = screen.getByRole('textbox', { name: /date/i });
    const timeInput = screen.getByRole('textbox', { name: /time/i });
    const amPmSelect = screen.getByRole('combobox', { name: /time format/i });
    const futureTime = dayjs().add(1, 'hour');

    await user.clear(dateInput);
    await user.type(dateInput, futureTime.format('DD/MM/YYYY'));
    await user.clear(timeInput);
    await user.type(timeInput, futureTime.format('hh:mm'));
    await user.selectOptions(amPmSelect, futureTime.format('A'));
    await user.tab();

    expect(screen.getByText(/start time cannot be in the future/i)).toBeInTheDocument();
  });

  it('starts a new visit upon successful submission of the form', async () => {
    const user = userEvent.setup();

    renderVisitForm();

    const saveButton = screen.getByRole('button', { name: /Start visit/i });

    // Set visit type
    await user.click(screen.getByLabelText(/Outpatient visit/i));

    // Set location
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    await user.click(saveButton);

    expect(mockSaveVisit).toHaveBeenCalledTimes(1);
    expect(mockSaveVisit).toHaveBeenCalledWith(
      expect.objectContaining({
        location: mockLocations.data.results[1].uuid,
        patient: mockPatient.id,
        visitType: 'some-uuid1',
      }),
      expect.any(Object),
    );

    expect(showSnackbar).toHaveBeenCalledTimes(1);
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      subtitle: expect.stringContaining('started successfully'),
      kind: 'success',
      title: 'Visit started',
    });
  });

  it('starts a new visit with attributes upon successful submission of the form', async () => {
    const user = userEvent.setup();

    renderVisitForm();

    const saveButton = screen.getByRole('button', { name: /Start visit/i });

    // Set visit type
    await user.click(screen.getByLabelText(/Outpatient visit/i));

    // Set location
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    const punctualityPicker = screen.getByRole('combobox', { name: 'Punctuality (optional)' });
    await user.selectOptions(punctualityPicker, 'On time');

    const insuranceNumberInput = screen.getByRole('textbox', { name: 'Insurance Policy Number (optional)' });
    await user.clear(insuranceNumberInput);
    await user.type(insuranceNumberInput, '183299');

    await user.click(saveButton);

    expect(mockSaveVisit).toHaveBeenCalledTimes(1);
    expect(mockSaveVisit).toHaveBeenCalledWith(
      expect.objectContaining({
        location: mockLocations.data.results[1].uuid,
        patient: mockPatient.id,
        visitType: 'some-uuid1',
      }),
      expect.any(Object),
    );

    expect(mockCreateVisitAttribute).toHaveBeenCalledTimes(2);
    expect(mockCreateVisitAttribute).toHaveBeenCalledWith(
      visitUuid,
      visitAttributes.punctuality.uuid,
      '66cdc0a1-aa19-4676-af51-80f66d78d9eb',
    );
    expect(mockCreateVisitAttribute).toHaveBeenCalledWith(
      visitUuid,
      visitAttributes.insurancePolicyNumber.uuid,
      '183299',
    );

    expect(mockOnVisitCreatedOrUpdatedCallback).toHaveBeenCalled();

    expect(mockCloseWorkspace).toHaveBeenCalled();

    expect(showSnackbar).toHaveBeenCalledTimes(2);
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      subtitle: expect.stringContaining('started successfully'),
      kind: 'success',
      title: 'Visit started',
    });
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      title: expect.stringContaining('Additional visit information updated successfully'),
      kind: 'success',
    });
  });

  it('updates visit attributes when editing an existing visit', async () => {
    const user = userEvent.setup();

    renderVisitForm(mockVisitWithAttributes);

    const saveButton = screen.getByRole('button', { name: /Update visit/i });

    // Set visit type
    await user.click(screen.getByLabelText(/Outpatient visit/i));

    // Set location
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    const punctualityPicker = screen.getByRole('combobox', { name: 'Punctuality (optional)' });
    await user.selectOptions(punctualityPicker, 'Late');

    const insuranceNumberInput = screen.getByRole('textbox', { name: 'Insurance Policy Number (optional)' });
    await user.clear(insuranceNumberInput);
    await user.type(insuranceNumberInput, '1873290');

    mockUpdateVisit.mockResolvedValue({
      status: 201,
      data: {
        uuid: visitUuid,
        visitType: {
          display: 'Facility Visit',
        },
      },
    } as unknown as FetchResponse<Visit>);

    await user.click(saveButton);

    expect(mockUpdateVisit).toHaveBeenCalledWith(
      mockVisitWithAttributes.uuid,
      expect.objectContaining({
        location: mockLocations.data.results[1].uuid,
        visitType: 'some-uuid1',
      }),
      expect.any(Object),
    );

    expect(mockUpdateVisitAttribute).toHaveBeenCalledTimes(2);
    expect(mockUpdateVisitAttribute).toHaveBeenCalledWith(
      visitUuid,
      'c98e66d7-7db5-47ae-b46f-91a0f3b6dda1',
      '66cdc0a1-aa19-4676-af51-80f66d78d9ec',
    );
    expect(mockUpdateVisitAttribute).toHaveBeenCalledWith(visitUuid, 'd6d7d26a-5975-4f03-8abb-db073c948897', '1873290');

    expect(mockCloseWorkspace).toHaveBeenCalled();
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      subtitle: 'Facility Visit updated successfully',
      kind: 'success',
      title: 'Visit details updated',
    });
  });

  it('deletes visit attributes if the value of the field is cleared when editing an existing visit', async () => {
    const user = userEvent.setup();

    renderVisitForm(mockVisitWithAttributes);

    const saveButton = screen.getByRole('button', { name: /Update visit/i });

    // Set visit type
    await user.click(screen.getByLabelText(/Outpatient visit/i));

    // Set location
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    const punctualityPicker = screen.getByRole('combobox', { name: 'Punctuality (optional)' });
    await user.selectOptions(punctualityPicker, 'Select an option');

    const insuranceNumberInput = screen.getByRole('textbox', { name: 'Insurance Policy Number (optional)' });
    await user.clear(insuranceNumberInput);

    mockUpdateVisit.mockResolvedValue({
      status: 201,
      data: {
        uuid: visitUuid,
        visitType: {
          display: 'Facility Visit',
        },
      },
    } as unknown as FetchResponse<Visit>);

    await user.click(saveButton);

    expect(mockUpdateVisit).toHaveBeenCalledWith(
      mockVisitWithAttributes.uuid,
      expect.objectContaining({
        location: mockLocations.data.results[1].uuid,
        visitType: 'some-uuid1',
      }),
      expect.any(Object),
    );

    expect(mockDeleteVisitAttribute).toHaveBeenCalledTimes(2);
    expect(mockDeleteVisitAttribute).toHaveBeenCalledWith(visitUuid, 'c98e66d7-7db5-47ae-b46f-91a0f3b6dda1');
    expect(mockDeleteVisitAttribute).toHaveBeenCalledWith(visitUuid, 'd6d7d26a-5975-4f03-8abb-db073c948897');

    expect(mockCloseWorkspace).toHaveBeenCalled();

    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      subtitle: 'Facility Visit updated successfully',
      kind: 'success',
      title: 'Visit details updated',
    });
  });

  it('renders an error message if there was a problem starting a new visit', async () => {
    const user = userEvent.setup();

    mockSaveVisit.mockRejectedValueOnce({ status: 500, statusText: 'Internal server error' });

    renderVisitForm();

    await user.click(screen.getByLabelText(/Outpatient visit/i));

    const saveButton = screen.getByRole('button', { name: /Start Visit/i });
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    await user.click(saveButton);

    expect(showSnackbar).toHaveBeenCalledTimes(1);
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'error',
        title: 'Error starting visit',
      }),
    );

    expect(mockOnVisitCreatedOrUpdatedCallback).not.toHaveBeenCalled();
    expect(mockCloseWorkspace).not.toHaveBeenCalled();
  });

  it('renders an error message if there was a problem updating visit attributes after starting a new visit', async () => {
    const user = userEvent.setup();

    mockCreateVisitAttribute.mockRejectedValue({ status: 500, statusText: 'Internal server error' });

    renderVisitForm();

    await user.click(screen.getByLabelText(/Outpatient visit/i));

    const saveButton = screen.getByRole('button', { name: /Start Visit/i });
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');

    const punctualityPicker = screen.getByRole('combobox', { name: 'Punctuality (optional)' });
    await user.selectOptions(punctualityPicker, 'On time');

    const insuranceNumberInput = screen.getByRole('textbox', { name: 'Insurance Policy Number (optional)' });
    await user.clear(insuranceNumberInput);
    await user.type(insuranceNumberInput, '183299');

    await user.click(saveButton);

    expect(showSnackbar).toHaveBeenCalledTimes(3);
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      subtitle: expect.stringContaining('started successfully'),
      kind: 'success',
      title: 'Visit started',
    });
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: false,
      subtitle: undefined,
      kind: 'error',
      title: 'Error creating the Punctuality visit attribute',
    });
    expect(showSnackbar).toHaveBeenCalledWith({
      isLowContrast: false,
      subtitle: undefined,
      kind: 'error',
      title: 'Error creating the Insurance Policy Number visit attribute',
    });

    expect(mockOnVisitCreatedOrUpdatedCallback).toHaveBeenCalled();
    expect(mockCloseWorkspace).not.toHaveBeenCalled();
  });

  it('displays a warning modal if the user attempts to discard the visit form with unsaved changes', async () => {
    const user = userEvent.setup();

    renderVisitForm();

    await user.click(screen.getByLabelText(/Outpatient visit/i));

    const closeButton = screen.getByRole('button', { name: /Discard/i });

    await user.click(closeButton);

    expect(mockCloseWorkspace).toHaveBeenCalled();
  });

  it('renders an inline error notification if an optional visit attribute type field fails to load', async () => {
    mockUseVisitAttributeType.mockReturnValue({
      isLoading: false,
      error: new Error('failed to load'),
      data: visitAttributes.punctuality,
    });

    renderVisitForm();

    expect(screen.getByText(/Part of the form did not load/i)).toBeInTheDocument();
    expect(screen.getByText(/Please refresh to try again/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start visit/i })).toBeEnabled();
  });

  it('renders an error if a required visit attribute type is not provided', async () => {
    const user = userEvent.setup();

    mockUseConfig.mockReturnValue({
      ...(getDefaultsFromConfigSchema(esmPatientChartSchema) as ChartConfig),
      visitAttributeTypes: [
        {
          uuid: visitAttributes.punctuality.uuid,
          required: true,
          displayInThePatientBanner: true,
        },
      ],
    });

    renderVisitForm();

    const saveButton = screen.getByRole('button', { name: /Start visit/i });

    // Set visit type
    await user.click(screen.getByLabelText(/Outpatient visit/i));

    // Set location
    const locationPicker = screen.getByRole('combobox', { name: /Select a location/i });
    await user.selectOptions(locationPicker, 'Inpatient Ward');
    await user.click(saveButton);

    expect(mockSaveVisit).not.toHaveBeenCalled();
  });

  it('should disable the submit button and display an inline error notification if required visit attribute fields fail to load', async () => {
    mockUseVisitAttributeType.mockReturnValue({
      isLoading: false,
      error: new Error('failed to load'),
      data: visitAttributes.punctuality,
    });

    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema,
      visitAttributeTypes: [
        {
          uuid: visitAttributes.punctuality.uuid,
          required: true,
          displayInThePatientBanner: true,
        },
      ],
    } as ChartConfig);

    renderVisitForm();

    expect(screen.getByText(/Part of the form did not load/i)).toBeInTheDocument();
    expect(screen.getByText(/Please refresh to try again/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start visit/i })).toBeDisabled();
  });
});

function renderVisitForm(visitToEdit?: Visit) {
  render(React.createElement(StartVisitForm, { ...testProps, visitToEdit }));
}
