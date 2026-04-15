import { type Actions, createGlobalStore, useStoreWithActions, type Visit } from '@openmrs/esm-framework';
import type { StoreApi } from 'zustand';
import { getOrCreateGlobalSingleton } from './global-singleton';

export interface PatientChartStore {
  patientUuid: string | null;
  patient: fhir.Patient | null;
  visitContext: Visit | null;
  mutateVisitContext: (() => void) | null;
}

const patientChartStoreName = 'patient-chart-global-store';

const patientChartStore = getOrCreateGlobalSingleton<StoreApi<PatientChartStore>>(patientChartStoreName, () =>
  createGlobalStore<PatientChartStore>(patientChartStoreName, {
    patientUuid: null,
    patient: null,
    visitContext: null,
    mutateVisitContext: null,
  }),
);

const patientChartStoreActions = {
  setPatient(patientStoreState, patient: fhir.Patient | null): Pick<PatientChartStore, 'patient' | 'patientUuid'> {
    void patientStoreState;
    return { patient, patientUuid: patient?.id ?? null };
  },
  setVisitContext(
    patientStoreState,
    visitContext: Visit | null,
    mutateVisitContext: (() => void) | null = null,
  ): Pick<PatientChartStore, 'visitContext' | 'mutateVisitContext'> {
    void patientStoreState;
    return { visitContext, mutateVisitContext };
  },
} satisfies Actions<PatientChartStore>;

type PatientChartStoreWithActions = PatientChartStore & {
  setPatient(patient: fhir.Patient | null): void;
  setVisitContext(visitContext: Visit | null, mutateVisitContext?: (() => void) | null): void;
};

/**
 * This function returns the patient chart store.
 *
 * The patient chart store is used to store all global variables used in the patient chart.
 * In the recent requirements, patient chart is now not only bound with `/patient/{patientUuid}/` path.
 */
export function getPatientChartStore(): StoreApi<PatientChartStore> {
  return patientChartStore;
}

export function usePatientChartStore(patientUuid?: string): PatientChartStoreWithActions {
  const store = useStoreWithActions(patientChartStore, patientChartStoreActions);

  if (!patientUuid || store.patientUuid === patientUuid) {
    return store;
  }

  return {
    ...store,
    mutateVisitContext: null,
    patient: null,
    patientUuid: null,
    setPatient: store.setPatient,
    setVisitContext: store.setVisitContext,
    visitContext: null,
  };
}

/**
 * This function will get the patient UUID from either URL, or will look into the patient chart store.
 * @returns {string} patientUuid
 */
export function getPatientUuidFromStore(): string {
  return patientChartStore.getState()?.patientUuid ?? '';
}
