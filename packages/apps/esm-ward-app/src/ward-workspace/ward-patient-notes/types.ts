import { type Concept, type OpenmrsResource } from '@openmrs/esm-framework';

export interface RESTPatientNote extends OpenmrsResource {
  uuid: string;
  display: string;
  encounterDatetime: string;
  encounterType: { name: string; uuid: string };
  encounterProviders: [{ encounterRole: { uuid: string; display: string }; provider: { person: { display: string } } }];
  location: { uuid: string; display: string; name: string };
  obs: Array<ObsData>;
  diagnoses: Array<OpenmrsResource>;
}

export interface PatientNote {
  id: string;
  diagnoses: string;
  encounterDate: string;
  encounterNote: string;
  encounterNoteRecordedAt: string;
  encounterProvider: string;
  encounterProviderRole: string;
  // Fields used by note history and delete modals (ported from upstream)
  encounterUuid?: string;
  obsUuid?: string;
  isEdited?: boolean;
  lastEditedBy?: string;
  lastEditedAt?: string;
  editHistory?: Array<{
    note: string;
    recordedAt: string;
    recordedBy: string;
  }>;
}

export interface UsePatientNotes {
  patientNotes: Array<PatientNote> | null;
  errorFetchingPatientNotes: Error;
  isLoadingPatientNotes: boolean;
  isValidatingPatientNotes?: boolean;
  mutatePatientNotes: () => void;
}

export interface ObsData {
  concept: Concept;
  value?: string | number | boolean | OpenmrsResource;
  groupMembers?: Array<{
    concept: Concept;
    value?: string | number | boolean | OpenmrsResource;
  }>;
  obsDatetime: string;
}
