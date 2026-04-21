import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { openmrsFetch } from '@openmrs/esm-framework';
import { mockFhirAllergyIntoleranceResponse, mockFhirPatient, renderWithSwr } from 'test-utils';
import AllergiesTile from './allergies-tile.extension';

const mockOpenmrsFetch = openmrsFetch as jest.Mock;

describe('AllergiesTile', () => {
  it('renders an empty state when allergy data is not available', async () => {
    mockOpenmrsFetch.mockReturnValueOnce({
      data: {
        total: 0,
        entry: [],
      },
    });
    renderWithSwr(<AllergiesTile patientUuid={mockFhirPatient.id} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/allergies/i)).toBeInTheDocument();
    expect(screen.getByText(/unknown/i)).toBeInTheDocument();
  });

  it("renders a summary of the patient's allergy data when available", async () => {
    mockOpenmrsFetch.mockReturnValueOnce({ data: mockFhirAllergyIntoleranceResponse });
    renderWithSwr(<AllergiesTile patientUuid={mockFhirPatient.id} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/allergies/i)).toBeInTheDocument();
    expect(screen.getByText(/ACE inhibitors, Fish, Penicillins, Morphine, Aspirin/i)).toBeInTheDocument();
  });
});
