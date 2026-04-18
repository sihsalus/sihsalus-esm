import { useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import React from 'react';

import EncounterObservations from './encounter-observation.component';

const mockUseConfig = jest.mocked(useConfig);

describe('EncounterObservations', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({
      obsConceptUuidsToHide: [],
    } as never);
  });

  it('falls back to concept display text when the concept name payload is missing', () => {
    render(
      <EncounterObservations
        observations={[
          {
            concept: {
              uuid: 'concept-uuid',
              display: 'Blood pressure',
            },
            value: '120/80',
          } as any,
        ]}
        formConceptMap={{}}
      />,
    );

    expect(screen.getByText('Blood pressure')).toBeInTheDocument();
    expect(screen.getByText('120/80')).toBeInTheDocument();
  });
});
