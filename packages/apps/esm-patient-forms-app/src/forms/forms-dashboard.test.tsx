import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import { mockCurrentVisit } from 'test-utils';
import React from 'react';
import { mockPatient } from 'test-utils';

import { configSchema, type ConfigObject } from '../config-schema';

import FormsDashboard from './forms-dashboard.component';

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
    render(<FormsDashboard patient={mockPatient} visitContext={mockCurrentVisit} handleFormOpen={jest.fn()} />);

    expect(screen.getByText(/there are no forms to display/i)).toBeInTheDocument();
  });
});
