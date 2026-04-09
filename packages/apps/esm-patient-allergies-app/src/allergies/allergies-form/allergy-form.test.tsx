import { getDefaultsFromConfigSchema, showSnackbar, useConfig } from '@openmrs/esm-framework';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockAllergens, mockAllergicReactions, mockAllergy } from '__mocks__';
import React from 'react';
import { mockPatient } from 'tools';

import { type AllergiesConfigObject, configSchema } from '../../config-schema';
import { AllergenType } from '../../types';

import {
  type NewAllergy,
  saveAllergy,
  useAllergens,
  useAllergicReactions,
  updatePatientAllergy,
} from './allergy-form.resource';
import AllergyForm from './allergy-form.workspace';

const mockSaveAllergy = jest.mocked(saveAllergy);
const mockShowSnackbar = jest.mocked(showSnackbar);
const mockUpdatePatientAllergy = jest.mocked(updatePatientAllergy);
const mockUseAllergens = jest.mocked(useAllergens);
const mockUseAllergicReactions = jest.mocked(useAllergicReactions);
const mockUseConfig = jest.mocked(useConfig<AllergiesConfigObject>);

jest.mock('./allergy-form.resource', () => ({
  ...jest.requireActual('./allergy-form.resource'),
  saveAllergy: jest.fn().mockResolvedValue({ data: {}, status: 201, statusText: 'Created' }),
  updatePatientAllergy: jest.fn().mockResolvedValue({ data: {}, status: 200, statusText: 'Updated' }),
  useAllergens: jest.fn(),
  useAllergicReactions: jest.fn(),
}));

const mockConcepts = {
  drugAllergenUuid: 'b864c337-64b1-4125-a4b2-f80b14d9a9b1',
  environmentalAllergenUuid: 'da133de2-1778-46c4-9511-8611fa748002',
  foodAllergenUuid: 'e85eb507-376b-4cc6-acf1-dec870ba421c',
  mildReactionUuid: '0c6478bd-ea06-40b2-a93f-a0a1f5c13b97',
  moderateReactionUuid: 'aed747d5-fba0-49fc-9e29-ebc56b62fb22',
  severeReactionUuid: 'b1b29870-eccd-4821-847c-668df29b4ad4',
  allergyReactionUuid: 'da2977c6-bb36-4ae2-b12d-46ede2d4fbec',
  otherConceptUuid: '62bd5ec8-5ffb-4ddc-97b4-84fde7bab601',
};

describe('AllergyForm', () => {
  beforeEach(() => {
    mockUseAllergens.mockReturnValue({
      isLoading: false,
      allergens: mockAllergens,
    });
    mockUseAllergicReactions.mockReturnValue({
      isLoading: false,
      allergicReactions: mockAllergicReactions,
    });
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      concepts: mockConcepts,
    });
  });

  it('renders the allergy form with all the expected fields and values', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergensContainer = screen.getByTestId('allergens-container');
    const allergenInput = screen.queryByPlaceholderText(/select the allergen/i);

    expect(allergenInput).toBeInTheDocument();
    await user.click(allergenInput);
    mockAllergens.forEach((allergen) => {
      expect(within(allergensContainer).getByText(allergen.display)).toBeInTheDocument();
    });

    expect(screen.getByText(/select the reactions/i)).toBeInTheDocument();
    mockAllergicReactions.forEach((reaction) => {
      expect(screen.getByRole('checkbox', { name: reaction.display })).toBeInTheDocument();
    });

    expect(screen.getByText(/severity of worst reaction/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /mild/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /moderate/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /severe/i })).toBeInTheDocument();

    expect(screen.getByText(/comments/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
  });

  it('enable the save button when all required fields are filled', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergen = mockAllergens[0];
    const reaction = mockAllergicReactions[0];

    const saveButton = screen.getByRole('button', { name: /save and close/i });
    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);

    expect(saveButton).toBeDisabled();

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    expect(saveButton).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    expect(saveButton).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    expect(saveButton).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /Clear selected item/i }));
    expect(saveButton).toBeDisabled();

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    expect(saveButton).toBeEnabled();

    // TODO: Fix O3-2629: changing the allergic reaction won't enable/disable the save button immediately.
  });

  it('calls the saveAllergy function with the correct payload', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);

    const allergen = mockAllergens[0];
    const reaction = mockAllergicReactions[0];
    const comment = 'some comment';

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    await user.type(screen.getByLabelText(/comments/i), comment);
    await user.click(screen.getByRole('button', { name: /save and close/i }));

    expect(mockSaveAllergy).toHaveBeenCalledTimes(1);

    const expectedPayload: NewAllergy = {
      allergen: {
        allergenType: allergen.type,
        codedAllergen: { uuid: allergen.uuid },
      },
      comment,
      reactions: [{ reaction: { uuid: reaction.uuid } }],
      severity: { uuid: mockConcepts.moderateReactionUuid },
    };

    expect(mockSaveAllergy.mock.calls[0][0]).toEqual(expectedPayload);
  });

  it('displays a custom input and a warning message when select other allergen', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);
    const allergensContainer = screen.getByTestId('allergens-container');

    await user.click(allergenInput);
    await user.click(within(allergensContainer).getByText(/other/i));

    const otherInput = screen.queryByLabelText(/Other non-coded allergen/i);
    expect(otherInput).toBeInTheDocument();

    const warningMessage = screen.queryByText(
      "Adding a custom allergen may impact system-wide allergy notifications. It's recommended to choose from the provided list for accurate alerts. Custom entries may not trigger notifications in all relevant contexts.",
    );
    expect(warningMessage).toBeInTheDocument();
  });

  it('calls the saveAllergy function with the correct payload when select other allergen', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);
    const allergensContainer = screen.getByTestId('allergens-container');
    const customAllergen = 'some other allergen';
    const reaction = mockAllergicReactions[0];
    const comment = 'some comment';

    await user.click(allergenInput);
    await user.click(within(allergensContainer).getByText(/other/i));

    const customAllergenInput = screen.getByLabelText(/Other non-coded allergen/i);

    await user.type(customAllergenInput, customAllergen);
    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    await user.type(screen.getByLabelText(/comments/i), comment);
    await user.click(screen.getByRole('button', { name: /save and close/i }));

    expect(mockSaveAllergy).toHaveBeenCalledTimes(1);
    const expectedPayload: NewAllergy = {
      allergen: {
        allergenType: AllergenType.OTHER,
        codedAllergen: { uuid: mockConcepts.otherConceptUuid },
        nonCodedAllergen: customAllergen,
      },
      comment,
      reactions: [{ reaction: { uuid: reaction.uuid } }],
      severity: { uuid: mockConcepts.moderateReactionUuid },
    };

    expect(mockSaveAllergy.mock.calls[0][0]).toEqual(expectedPayload);
  });

  it('renders a success notification after successful submission', async () => {
    const user = userEvent.setup();

    renderAllergyForm();

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);

    const allergen = mockAllergens[0];
    const reaction = mockAllergicReactions[0];
    const comment = 'some comment';

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    await user.type(screen.getByLabelText(/comments/i), comment);
    await user.click(screen.getByRole('button', { name: /save and close/i }));

    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      isLowContrast: true,
      kind: 'success',
      title: 'Allergy saved',
      subtitle: 'It is now visible on the Allergies page',
    });
  });

  it('renders an error snackbar upon an invalid submission', async () => {
    const user = userEvent.setup();

    mockSaveAllergy.mockRejectedValue({
      message: 'Internal Server Error',
      response: {
        status: 500,
        statusText: 'Internal Server Error',
      },
    });

    renderAllergyForm();

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);

    const allergen = mockAllergens[0];
    const reaction = mockAllergicReactions[0];
    const comment = 'some comment';

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    await user.type(screen.getByLabelText(/comments/i), comment);
    await user.click(screen.getByRole('button', { name: /save and close/i }));

    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      isLowContrast: false,
      title: 'Error saving allergy',
      subtitle: 'Internal Server Error',
      kind: 'error',
    });
  });

  it('Edit Allergy should call the saveAllergy function with updated payload', async () => {
    const user = userEvent.setup();

    renderAllergyForm({ allergy: mockAllergy, formContext: 'editing' });

    const allergenInput = screen.getByPlaceholderText(/select the allergen/i);
    const commentInput = screen.getByLabelText(/comments/i);

    const allergen = mockAllergens[2];
    const reaction = mockAllergicReactions[0];
    const comment = 'new comment';

    await user.click(allergenInput);
    await user.click(screen.getByText(allergen.display));
    await user.click(screen.getByRole('checkbox', { name: reaction.display }));
    await user.click(screen.getByRole('radio', { name: /moderate/i }));
    await user.clear(commentInput);
    await user.type(commentInput, comment);
    await user.click(screen.getByRole('button', { name: /save and close/i }));

    expect(mockUpdatePatientAllergy).toHaveBeenCalledTimes(1);

    const expectedPayload: NewAllergy = {
      allergen: {
        allergenType: allergen.type,
        codedAllergen: { uuid: allergen.uuid },
      },
      comment,
      reactions: [
        { reaction: { uuid: reaction.uuid } },
        { reaction: { uuid: mockAllergicReactions[2].uuid } },
        { reaction: { uuid: mockAllergicReactions[3].uuid } },
      ],
      severity: { uuid: mockConcepts.moderateReactionUuid },
    };

    expect(mockUpdatePatientAllergy.mock.calls[0][0]).toEqual(expectedPayload);
    expect(mockAllergy).not.toEqual(expectedPayload);
  });
});

function renderAllergyForm(props = {}) {
  const defaultProps = {
    closeWorkspace: () => {},
    closeWorkspaceWithSavedChanges: () => {},
    promptBeforeClosing: () => {},
    allergy: null,
    formContext: 'creating' as 'creating' | 'editing',
    patient: mockPatient,
    patientUuid: mockPatient.id,
    setTitle: jest.fn(),
  };

  render(<AllergyForm {...defaultProps} {...props} />);
}
