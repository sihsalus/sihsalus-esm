import { type FetchResponse, openmrsFetch } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import React from 'react';

import AppointmentsMetrics from './appointments-metrics.component';

const mockOpenmrsFetch = jest.mocked(openmrsFetch);

jest.mock('../hooks/useClinicalMetrics', () => ({
  ...jest.requireActual('../hooks/useClinicalMetrics'),
  useClinicalMetrics: jest.fn().mockReturnValue({
    highestServiceLoad: {
      serviceName: 'Outpatient',
      count: 4,
    },
    isLoading: false,
    error: null,
  }),
  useAllAppointmentsByDate: jest.fn().mockReturnValue({
    totalProviders: 4,
    isLoading: false,
    error: null,
  }),
  useScheduledAppointments: jest.fn().mockReturnValue({
    totalScheduledAppointments: 16,
  }),
  useAppointmentDate: jest.fn().mockReturnValue({
    startDate: '2024-01-01',
  }),
}));

describe('Appointment metrics', () => {
  it('should render metrics cards with the correct data', async () => {
    mockOpenmrsFetch.mockResolvedValueOnce({
      data: [],
    } as unknown as FetchResponse);

    render(<AppointmentsMetrics appointmentServiceTypes={['consultation-service-uuid']} />);

    await screen.findByText(/appointment metrics/i);
    expect(screen.getByText(/scheduled appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/^appointments$/i)).toBeInTheDocument();
    expect(screen.getByText(/16/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^4$/i)).toHaveLength(2);
  });
});
