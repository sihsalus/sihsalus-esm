import type { FetchResponse, FHIRResource } from '@openmrs/esm-framework';

type ReferenceRangeValue = number | null | undefined;

export type FHIRSearchBundleResponse = FetchResponse<{
  entry: Array<FHIRResource>;
  link: Array<{ relation: string; url: string }>;
}>;

export interface ObsReferenceRanges {
  hiAbsolute: ReferenceRangeValue;
  hiCritical: ReferenceRangeValue;
  hiNormal: ReferenceRangeValue;
  lowNormal: ReferenceRangeValue;
  lowCritical: ReferenceRangeValue;
  lowAbsolute: ReferenceRangeValue;
}

export type ObservationInterpretation = 'critically_low' | 'critically_high' | 'high' | 'low' | 'normal';

export type MappedVitals = {
  code: string;
  interpretation: string;
  recordedDate: Date;
  value: number;
};

export interface PatientVitalsAndBiometrics {
  id: string;
  date: string;
  systolic?: number;
  diastolic?: number;
  bloodPressureRenderInterpretation?: ObservationInterpretation;
  pulse?: number;
  temperature?: number;
  spo2?: number;
  height?: number;
  weight?: number;
  headCircumference?: number; // headCircumferenceUuid (c4d39248-c896-433a-bc69-e24d04b7f0e5)
  chestCircumference?: number; // chestCircumferenceUuid (911eb398-e7de-4270-af63-e4c615ec22a9)

  stoolCount?: number; // Número de deposiciones por día
  stoolGrams?: number; // Peso de deposiciones en gramos
  urineCount?: number; // Número de micciones por día
  urineGrams?: number; // Volumen de orina en gramos/mL
  vomitCount?: number; // Número de episodios de vómito por día
  vomitGramsML?: number; // Volumen de vómito en gramos/mL

  bmi?: number | null;
  respiratoryRate?: number;
  muac?: number;
}

export interface VitalsResponse {
  entry: Array<{
    resource: FHIRResource['resource'];
  }>;
  id: string;
  meta: {
    lastUpdated: string;
  };
  link: Array<{
    relation: string;
    url: string;
  }>;
  resourceType: string;
  total: number;
  type: string;
}

export interface LabourHistoryTableRow extends PatientVitalsAndBiometrics {
  id: string; // Unique identifier for the row
  date: string; // Date of the observation or encounter
  admissionDate?: string; // Date and time of admission
  terminationDate?: string; // Date and time of termination
  maternalPulse?: number | string; // Maternal pulse in beats per minute (bpm)
  systolicBP?: number | string; // Systolic blood pressure in mmHg
  diastolicBP?: number | string; // Diastolic blood pressure in mmHg
  maternalWeight?: number | string; // Maternal weight in Kg
  gestationalAge?: number | string; // Gestational age in weeks
  fetalHeartRate?: number | string; // Fetal heart rate in bpm
  uterineHeight?: number | string; // Uterine height in cm
  dilatation?: number | string; // Cervical dilatation in cm
  amnioticFluid?: string; // Description of amniotic fluid
  ruptureDate?: string; // Date of membrane rupture
  deliveryStart?: string; // Start of delivery
  deliveryType?: string; // Type of delivery
}

export interface LabourHistoryTableHeader {
  key:
    | 'maternalPulseRender' // New key
    | 'systolicBPRender' // New key
    | 'diastolicBPRender' // New key
    | 'maternalWeightRender' // New key
    | 'gestationalAgeRender' // New key
    | 'fetalHeartRateRender' // New key
    | 'uterineHeightRender' // New key
    | 'dilatationRender' // New key
    | 'amnioticFluidRender' // New key
    | 'membranesRender' // New key
    | 'ruptureDateRender' // New key
    | 'deliveryStartRender' // New key
    | 'deliveryTypeRender'; // New key

  header: string;
  isSortable?: boolean;
  sortFunc: (valueA: LabourHistoryTableRow, valueB: LabourHistoryTableRow) => number;
}
