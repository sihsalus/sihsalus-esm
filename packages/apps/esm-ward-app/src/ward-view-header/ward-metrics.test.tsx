import { useAppContext } from '@openmrs/esm-framework';
import { screen } from '@testing-library/react';

import { renderWithSwr } from 'test-utils';
import { mockWardViewContext } from '../../../test-utils/mock';
import { type WardViewContext } from '../types';
import { getWardMetrics } from '../ward-view/ward-view.resource';

import WardMetrics from './ward-metrics.component';

const wardMetrics = [
  { name: 'patients', key: 'patients', defaultTranslation: 'Patients' },
  { name: 'freeBeds', key: 'freeBeds', defaultTranslation: 'Free beds' },
  { name: 'capacity', key: 'capacity', defaultTranslation: 'Capacity' },
];

jest.mocked(useAppContext<WardViewContext>).mockReturnValue(mockWardViewContext);

describe('Ward Metrics', () => {
  it('Should display metrics of in the ward ', () => {
    const mockWardPatientGroupDetails = mockWardViewContext.wardPatientGroupDetails;
    const { bedLayouts } = mockWardPatientGroupDetails;
    const bedMetrics = getWardMetrics(bedLayouts, mockWardPatientGroupDetails);
    renderWithSwr(<WardMetrics />);
    for (const [key] of Object.entries(bedMetrics)) {
      const fieldName = wardMetrics.find((metric) => metric.name === key)?.defaultTranslation;
      expect(fieldName).toBeTruthy();
      if (fieldName) {
        expect(screen.getByText(fieldName)).toBeInTheDocument();
      }
    }
  });
});
