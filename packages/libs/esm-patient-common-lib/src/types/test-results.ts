export type ConceptUuid = string;
export type ObsUuid = string;

export interface ObservationCoding {
  code?: string;
  display?: string;
}

export interface ObservationCodeableConcept {
  coding: Array<ObservationCoding>;
  text?: string;
}

export interface ObservationReference {
  reference: string;
}

export interface ObsRecord {
  id: ObsUuid;
  members?: Array<ObsRecord>;
  hasMember?: Array<ObservationReference>;
  conceptClass: ConceptUuid;
  code?: {
    coding: Array<ObservationCoding>;
  };
  meta?: ObsMetaInfo;
  name?: string;
  value?: string | number;
  issued?: string;
  valueCodeableConcept?: ObservationCodeableConcept;
  valueQuantity?: {
    value: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  effectiveDateTime: string;
  encounter?: {
    reference: string;
    type: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [_: string]: unknown;
}

export interface ObsMetaInfo {
  hiAbsolute?: number;
  hiCritical?: number;
  hiNormal?: number;
  lowAbsolute?: number;
  lowCritical?: number;
  lowNormal?: number;
  units?: string;
  datatype?: string;
  range?: string;
  assessValue?: (value: string) => OBSERVATION_INTERPRETATION;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [_: string]: unknown;
}

export interface ConceptRecord {
  uuid: ConceptUuid;
  display?: string;
  conceptClass?: {
    name?: string;
    display?: string;
  };
  hiAbsolute?: number;
  hiCritical?: number;
  hiNormal?: number;
  lowAbsolute?: number;
  lowCritical?: number;
  lowNormal?: number;
  units?: string;
  datatype?: {
    display?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [_: string]: unknown;
}

export interface PatientData {
  [_: string]: {
    entries: Array<ObsRecord>;
    type: 'LabSet' | 'Test';
    uuid: string;
  };
}

export type OBSERVATION_INTERPRETATION =
  | 'NORMAL'
  | 'HIGH'
  | 'CRITICALLY_HIGH'
  | 'OFF_SCALE_HIGH'
  | 'LOW'
  | 'CRITICALLY_LOW'
  | 'OFF_SCALE_LOW'
  | '--';

export interface ExternalOverviewProps {
  patientUuid: string;
  filter: (filterProps: PanelFilterProps) => boolean;
}

export type PanelFilterProps = [ObsRecord, string, string, string];
