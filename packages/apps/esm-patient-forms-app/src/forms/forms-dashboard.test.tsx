import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { mockCurrentVisit, mockPatient } from 'test-utils';

import { type ConfigObject, configSchema } from '../config-schema';

import FormsDashboard from './forms-dashboard.component';

void React;

const mockFhirPatient = mockPatient as unknown as fhir.Patient;
const mockUseConfig = jest.mocked(useConfig<ConfigObject>);

jest.mock('../hooks/use-forms', () => ({
  useForms: jest.fn().mockReturnValue({
    data: [],
    error: null,
    isValidating: false,
  }),
}));

mockUseConfig.mockReturnValue({ ...getDefaultsFromConfigSchema(configSchema), htmlFormEntryForms: [] });

describe('FormsDashboard', () => {
  test('renders an empty state if there are no forms persisted on the server', async () => {
    render(<FormsDashboard patient={mockFhirPatient} visitContext={mockCurrentVisit} handleFormOpen={jest.fn()} />);

    expect(screen.getByText(/there are no forms to display/i)).toBeInTheDocument();
  });
});
