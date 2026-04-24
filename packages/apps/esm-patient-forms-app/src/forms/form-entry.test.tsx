import { ExtensionSlot, useConfig, useConnectivity, usePatient, Workspace2 } from '@openmrs/esm-framework';
import { useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { mockPatient } from 'test-utils';

import FormEntryWorkspace from './form-entry.workspace';

void React;

const mockFhirPatient = mockPatient as unknown as fhir.Patient;
const mockExtensionSlot = jest.mocked(ExtensionSlot);
const mockUseVisitOrOfflineVisit = useVisitOrOfflineVisit as jest.Mock;
const mockUsePatient = jest.mocked(usePatient);
const mockWorkspace2 = jest.mocked(Workspace2);
const mockUseConfig = jest.mocked(useConfig);
const mockUseConnectivity = jest.mocked(useConnectivity);
const mockUseSWR = useSWR as jest.Mock;
const mockUseSWRConfig = useSWRConfig as jest.Mock;
const workspace2DefinitionProps = {
  launchChildWorkspace: jest.fn(),
  windowProps: {},
  workspaceName: 'patient-form-entry-workspace-v2',
  windowName: 'patient-chart-workspace-window',
  isRootWorkspace: true,
  showActionMenu: false,
};

const mockCurrentVisit = {
  uuid: '17f512b4-d264-4113-a6fe-160cb38cb46e',
  encounters: [],
  patient: { uuid: '8673ee4f-e2ab-4077-ba55-4980f408773e' },
  visitType: {
    uuid: '7b0f5697-27e3-40c4-8bae-f4049abfb4ed',
    display: 'Facility Visit',
  },
  attributes: [],
  startDatetime: new Date('2021-03-16T08:16:00.000+0000').toISOString(),
  stopDatetime: null,
  location: {
    uuid: '6351fcf4-e311-4a19-90f9-35667d99a8af',
    name: 'Registration Desk',
    display: 'Registration Desk',
  },
};

jest.mock('../hooks/use-forms', () => ({
  useForms: jest.fn().mockReturnValue({ mutateForms: jest.fn() }),
}));

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');

  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
    useSWRConfig: jest.fn(),
  };
});

jest.mock('@openmrs/esm-patient-common-lib', () => {
  return {
    clinicalFormsWorkspace: 'clinical-forms-workspace',
    invalidateVisitAndEncounterData: jest.fn(),
    useVisitOrOfflineVisit: jest.fn(),
  };
});

jest.mock('@openmrs/esm-framework', () => ({
  ExtensionSlot: jest.fn().mockImplementation(({ name }: { name?: string }) => name),
  Workspace2: jest.fn().mockImplementation(({ children }: { children?: React.ReactNode }) => <div>{children}</div>),
  usePatient: jest.fn(),
  useConfig: jest.fn(),
  useConnectivity: jest.fn(),
  openmrsFetch: jest.fn(),
}));

describe('FormEntryWorkspace', () => {
  beforeEach(() => {
    mockUsePatient.mockReturnValue({
      patient: mockFhirPatient,
      patientUuid: mockPatient.uuid,
      error: null,
      isLoading: false,
    });
    mockUseVisitOrOfflineVisit.mockReturnValue({ currentVisit: mockCurrentVisit });
    mockUseConfig.mockReturnValue({ htmlFormEntryForms: [] });
    mockUseConnectivity.mockReturnValue(true);
    mockUseSWR.mockReturnValue({ data: undefined, isLoading: false });
    mockUseSWRConfig.mockReturnValue({ mutate: jest.fn() });
  });

  it('keeps the legacy formInfo path working for compatibility callers', async () => {
    render(
      <FormEntryWorkspace
        {...workspace2DefinitionProps}
        closeWorkspace={jest.fn()}
        groupProps={{
          patientUuid: mockPatient.uuid,
          patient: mockFhirPatient,
          visitContext: mockCurrentVisit,
          mutateVisitContext: jest.fn(),
        }}
        workspaceProps={
          {
            formInfo: { formUuid: 'some-form-uuid' },
            mutateForm: jest.fn(),
          } as any
        }
      />,
    );

    await waitFor(() =>
      expect(mockExtensionSlot).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'form-widget-slot',
          state: expect.objectContaining({
            formUuid: 'some-form-uuid',
            patientUuid: mockPatient.uuid,
            visit: expect.objectContaining({
              uuid: mockCurrentVisit.uuid,
            }),
          }),
        }),
        expect.anything(),
      ),
    );
  });

  it('renders the workspace2 form-entry path for v12-shaped callers', async () => {
    render(
      <FormEntryWorkspace
        {...workspace2DefinitionProps}
        closeWorkspace={jest.fn()}
        groupProps={{
          patientUuid: mockPatient.uuid,
          patient: mockFhirPatient,
          visitContext: mockCurrentVisit,
          mutateVisitContext: jest.fn(),
        }}
        workspaceProps={
          {
            form: {
              uuid: 'some-form-uuid',
              name: 'Test form',
              display: 'Test form',
              version: '1',
              published: true,
              retired: false,
              resources: [],
            },
          } as any
        }
      />,
    );

    await waitFor(() => expect(mockWorkspace2).toHaveBeenCalled());
    expect(mockExtensionSlot).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'visit-context-header-slot',
        state: { patientUuid: mockPatient.uuid },
      }),
      expect.anything(),
    );
    expect(mockExtensionSlot).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'form-widget-slot',
        state: expect.objectContaining({
          formUuid: 'some-form-uuid',
          patientUuid: mockPatient.uuid,
          visit: mockCurrentVisit,
        }),
      }),
      expect.anything(),
    );
  });

  it('keeps the workspace2 form slot state stable when closeWorkspace changes', async () => {
    const workspaceProps = {
      form: {
        uuid: 'some-form-uuid',
        name: 'Test form',
        display: 'Test form',
        version: '1',
        published: true,
        retired: false,
        resources: [],
      },
    } as any;
    const groupProps = {
      patientUuid: mockPatient.uuid,
      patient: mockFhirPatient,
      visitContext: mockCurrentVisit,
      mutateVisitContext: jest.fn(),
    };
    const { rerender } = render(
      <FormEntryWorkspace
        {...workspace2DefinitionProps}
        closeWorkspace={jest.fn()}
        groupProps={groupProps}
        workspaceProps={workspaceProps}
      />,
    );

    await waitFor(() =>
      expect(
        mockExtensionSlot.mock.calls.find(([props]: Array<any>) => props.name === 'form-widget-slot')?.[0]?.state,
      ).toBeDefined(),
    );

    const initialState = mockExtensionSlot.mock.calls.find(
      ([props]: Array<any>) => props.name === 'form-widget-slot',
    )?.[0]?.state;

    rerender(
      <FormEntryWorkspace
        {...workspace2DefinitionProps}
        closeWorkspace={jest.fn()}
        groupProps={groupProps}
        workspaceProps={workspaceProps}
      />,
    );

    await waitFor(() =>
      expect(
        mockExtensionSlot.mock.calls.filter(([props]: Array<any>) => props.name === 'form-widget-slot').length,
      ).toBeGreaterThan(1),
    );

    const nextState = mockExtensionSlot.mock.calls
      .filter(([props]: Array<any>) => props.name === 'form-widget-slot')
      .at(-1)?.[0]?.state;

    expect(nextState).toBe(initialState);
  });
});
