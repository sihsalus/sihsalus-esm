import {
  type AssignedExtension,
  type ExtensionSlotState,
  ExtensionSlot,
  useExtensionStore,
  useExtensionSlotMeta,
} from '@openmrs/esm-framework';
import { screen, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mockPatient } from 'test-utils';

import ChartReview from './chart-review.component';

const mockUseExtensionStore = jest.mocked(useExtensionStore);
const mockUseExtensionSlotMeta = jest.mocked(useExtensionSlotMeta);
const mockExtensionSlot = jest.mocked(ExtensionSlot);

jest.mock('@openmrs/esm-patient-common-lib', () => {
  return {
    useNavGroups: jest.fn().mockReturnValue({ navGroups: [] }),
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(),
  useMatch: jest.fn().mockReturnValue({
    params: {
      url: '/patient/8673ee4f-e2ab-4077-ba55-4980f408773e/chart',
      view: 'Patient Summary',
    },
  }),
}));

function slotMetaFromStore(store, slotName) {
  return Object.fromEntries(
    store.slots[slotName].assignedExtensions.map((e) => {
      return [e.name, e.meta];
    }),
  );
}

describe('ChartReview', () => {
  beforeEach(() => {
    mockExtensionSlot.mockImplementation(({ children }) => {
      if (typeof children === 'function') {
        return children({
          id: 'mocked-extension',
          meta: {},
          moduleName: '@openmrs/esm-patient-chart-app',
        } as AssignedExtension);
      }

      return children ?? null;
    });
  });

  test('renders a grid-based layout', () => {
    const mockStore = {
      slots: {
        'patient-chart-dashboard-slot': {
          assignedExtensions: [
            {
              name: 'charts-summary-dashboard',
              meta: {
                slot: 'patient-chart-summary-dashboard-slot',
                path: 'Patient Summary',
                title: 'Patient Summary',
              },
            },
            {
              name: 'test-results-summary-dashboard',
              meta: {
                slot: 'patient-chart-test-results-dashboard-slot',
                path: 'Test Results',
                title: 'Test Results',
              },
            },
          ] as unknown as AssignedExtension[],
        },
        'patient-chart-summary-dashboard-slot': {
          assignedExtensions: [],
        },
      } as Record<string, ExtensionSlotState>,
    };

    mockUseExtensionStore.mockReturnValue(mockStore as unknown as ReturnType<typeof useExtensionStore>);
    mockUseExtensionSlotMeta.mockImplementation((slotName) => slotMetaFromStore(mockStore, slotName));

    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ChartReview patient={mockPatient} patientUuid={mockPatient.id} view="Patient Summary" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(/Patient summary/i);
  });
});
