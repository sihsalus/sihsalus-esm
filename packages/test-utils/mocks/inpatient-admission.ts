import { type InpatientAdmission } from '../../apps/esm-ward-app/src/types';
import { mockEncounterAlice } from './encounter-ward.mock';
import { mockLocationInpatientWard } from './locations.mock';
import { mockPatientAlice } from './patient.mock';
import { mockVisitAlice } from './visits.mock';

export const mockInpatientAdmissionAlice: InpatientAdmission = {
  patient: mockPatientAlice,
  visit: mockVisitAlice,
  currentInpatientRequest: null,
  firstAdmissionOrTransferEncounter: mockEncounterAlice,
  encounterAssigningToCurrentInpatientLocation: mockEncounterAlice,
  currentInpatientLocation: mockLocationInpatientWard,
};
