import { ActionMenuButton, useLayoutType, usePatient, useWorkspaces } from '@openmrs/esm-framework';
import {
  type OrderBasketItem,
  useLaunchWorkspaceRequiringVisit,
  useOrderBasket,
} from '@openmrs/esm-patient-common-lib';
import { orderBasketStore } from '@openmrs/esm-patient-common-lib/src/orders/store';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { mockPatient } from 'test-utils';

import OrderBasketActionButton from './order-basket-action-button.extension';

const mockUseLayoutType = jest.mocked(useLayoutType);
const mockUsePatient = jest.mocked(usePatient);
const mockUseWorkspaces = useWorkspaces as jest.Mock;
const MockActionMenuButton = jest.mocked(ActionMenuButton);
const mockUseLaunchWorkspaceRequiringVisit = useLaunchWorkspaceRequiringVisit as jest.Mock;
const mockFhirPatient = mockPatient as unknown as fhir.Patient;

MockActionMenuButton.mockImplementation(({ handler, label, tagContent }) => (
  <button onClick={handler}>
    {tagContent} {label}
  </button>
));

mockUseWorkspaces.mockReturnValue({
  workspaces: [{ type: 'order' }],
  workspaceWindowState: 'normal',
});

// This pattern of mocking seems to be required: defining the mocked function here and
// then assigning it with an arrow function wrapper in jest.mock. It is very particular.
// I think it is related to this: https://github.com/swc-project/jest/issues/14#issuecomment-1238621942

const mockLaunchPatientWorkspace = jest.fn();
const mockLaunchStartVisitPrompt = jest.fn();
const mockUseVisitOrOfflineVisit = jest.fn(() => ({
  activeVisit: {
    uuid: '8ef90c91-14be-42dd-a1c0-e67fbf904470',
  },
  currentVisit: {
    uuid: '8ef90c91-14be-42dd-a1c0-e67fbf904470',
  },
}));
const mockGetPatientUuidFromUrl = jest.fn(() => mockPatient.id);
const mockUseSystemVisitSetting = jest.fn();

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    getPatientUuidFromUrl: () => mockGetPatientUuidFromUrl(),
    getPatientUuidFromStore: () => mockGetPatientUuidFromUrl(),
    useLaunchWorkspaceRequiringVisit: jest.fn(),
    launchPatientWorkspace: (arg) => mockLaunchPatientWorkspace(arg),
  };
});

jest.mock('@openmrs/esm-patient-common-lib/src/useSystemVisitSetting', () => {
  return {
    useSystemVisitSetting: () => mockUseSystemVisitSetting(),
  };
});

jest.mock('@openmrs/esm-patient-common-lib/src/launchStartVisitPrompt', () => {
  return { launchStartVisitPrompt: () => mockLaunchStartVisitPrompt() };
});

jest.mock('@openmrs/esm-patient-common-lib/src/store/patient-chart-store', () => {
  return {
    getPatientUuidFromStore: () => mockGetPatientUuidFromUrl(),
    usePatientChartStore: () => ({ patientUuid: mockPatient.id }),
  };
});

jest.mock('@openmrs/esm-patient-common-lib/src/offline/visit', () => {
  return { useVisitOrOfflineVisit: () => mockUseVisitOrOfflineVisit() };
});

mockUsePatient.mockReturnValue({
  patient: mockFhirPatient,
  patientUuid: mockPatient.id,
  isLoading: false,
  error: null,
});
mockUseSystemVisitSetting.mockReturnValue({ systemVisitEnabled: false });

describe('<OrderBasketActionButton/>', () => {
  beforeAll(() => {
    orderBasketStore.setState({
      items: {
        [mockPatient.id]: {
          medications: [{ name: 'order-01', uuid: 'some-uuid' } as unknown as OrderBasketItem],
        },
      },
    });
  });

  beforeEach(() => {
    mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(jest.fn());
  });

  it('should display tablet view action button', async () => {
    const user = userEvent.setup();
    const mockLaunchOrderBasket = jest.fn();
    mockUseLayoutType.mockReturnValue('tablet');
    mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(mockLaunchOrderBasket);
    render(<OrderBasketActionButton />);

    const orderBasketButton = screen.getByRole('button', { name: /Order Basket/i });
    expect(orderBasketButton).toBeInTheDocument();
    await user.click(orderBasketButton);
    expect(mockUseLaunchWorkspaceRequiringVisit).toHaveBeenCalledWith('order-basket');
    expect(mockLaunchOrderBasket).toHaveBeenCalled();
  });

  it('should display desktop view action button', async () => {
    const user = userEvent.setup();
    const mockLaunchOrderBasket = jest.fn();
    mockUseLayoutType.mockReturnValue('small-desktop');
    mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(mockLaunchOrderBasket);
    render(<OrderBasketActionButton />);

    const orderBasketButton = screen.getByRole('button', { name: /order basket/i });
    expect(orderBasketButton).toBeInTheDocument();
    await user.click(orderBasketButton);
    expect(mockUseLaunchWorkspaceRequiringVisit).toHaveBeenCalledWith('order-basket');
    expect(mockLaunchOrderBasket).toHaveBeenCalled();
  });

  it('should render the action button even if no currentVisit is found', async () => {
    const user = userEvent.setup();
    const mockLaunchOrderBasket = jest.fn();
    mockUseLayoutType.mockReturnValue('small-desktop');
    mockUseSystemVisitSetting.mockReturnValue({ systemVisitEnabled: true });
    mockUseVisitOrOfflineVisit.mockImplementation(() => ({
      activeVisit: null,
      currentVisit: null,
    }));
    mockUseLaunchWorkspaceRequiringVisit.mockReturnValue(mockLaunchOrderBasket);

    render(<OrderBasketActionButton />);

    const orderBasketButton = screen.getByRole('button', { name: /order basket/i });
    expect(orderBasketButton).toBeInTheDocument();
    await user.click(orderBasketButton);
    expect(mockUseLaunchWorkspaceRequiringVisit).toHaveBeenCalledWith('order-basket');
    expect(mockLaunchOrderBasket).toHaveBeenCalled();
  });

  it('should display a count tag when orders are present on the desktop view', () => {
    mockUseLayoutType.mockReturnValue('small-desktop');
    const { result } = renderHook(useOrderBasket);
    expect(result.current.orders).toHaveLength(1); // sanity check
    render(<OrderBasketActionButton />);

    expect(screen.getByText(/order basket/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it('should display the count tag when orders are present on the tablet view', () => {
    mockUseLayoutType.mockReturnValue('tablet');
    render(<OrderBasketActionButton />);

    expect(screen.getByRole('button', { name: /1 order basket/i })).toBeInTheDocument();
  });
});
