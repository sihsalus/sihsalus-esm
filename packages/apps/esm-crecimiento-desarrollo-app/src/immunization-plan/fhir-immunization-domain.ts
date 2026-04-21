export type OpenmrsConcept = {
  existingDoses: Array<Record<string, unknown>>;
  uuid: string;
  display: string;
  setMembers?: Array<OpenmrsConcept>;
  answers?: Array<OpenmrsConcept>;
};

export type Code = {
  code: string;
  system?: string;
  display: string;
};

export type Reference = {
  type: string;
  reference: string;
};

export type FHIRImmunizationResource = {
  resourceType: 'Immunization';
  status: 'completed';
  id: string;
  vaccineCode: { coding: Array<Code> };
  patient: Reference;
  encounter: Reference;
  occurrenceDateTime: Date;
  expirationDate: Date;
  location: Reference;
  performer: Array<{ actor: Reference }>;
  manufacturer: { display: string };
  lotNumber: string;
  protocolApplied: [
    {
      doseNumberPositiveInt: number;
      series?: string;
    },
  ];
};
export type FHIRImmunizationBundleEntry = {
  fullUrl: string;
  resource: FHIRImmunizationResource;
};

export type FHIRImmunizationBundle = {
  resourceType: 'Bundle';
  entry: Array<FHIRImmunizationBundleEntry>;
};

export type ImmunizationSequence = {
  sequenceLabel: string;
  sequenceNumber: number;
};

export type ImmunizationSequenceDefinition = {
  vaccineConceptUuid: string;
  sequences: Array<ImmunizationSequence>;
};

export type ImmunizationWidgetConfigObject = {
  immunizationConceptSet: string;
  sequenceDefinitions: Array<ImmunizationSequenceDefinition>;
};

export type ImmunizationDoseData = {
  immunizationObsUuid: string;
  manufacturer: string;
  lotNumber: string;
  doseNumber: number;
  occurrenceDateTime: string;
  expirationDate: string;
  meta?: {
    encounterUuid?: string;
    location?: string;
  };
};

/*This represents a single consolidated immunization used on the UI with below details
- Vaccine name and uuid
- Existing doese given to patient for that vaccine
- Sequences configured for that vaccine
  */
export type ImmunizationData = {
  vaccineName: string;
  vaccineUuid: string;
  existingDoses: Array<ImmunizationDoseData>;
  sequences?: Array<ImmunizationSequence>;
};

// Código y sistema asociado (e.g., SNOMED, LOINC, etc.)
export type FHIRCode = {
  code: string;
  system?: string; // URL del sistema (e.g., "http://snomed.info/sct")
  display: string;
};

// Referencia a un recurso FHIR relacionado
export type FHIRReference = {
  type: string; // Tipo del recurso (e.g., "Patient", "Practitioner", "Location")
  reference: string; // Referencia al recurso (e.g., "Patient/12345")
  display?: string; // Nombre legible del recurso
};

// Representa un esquema consolidado de vacunación para un paciente
export type ImmunizationScheduleData = {
  scheduleName: string; // Nombre del esquema de vacunación (e.g., "Esquema Nacional").
  scheduleUuid: string; // UUID único que identifica el esquema.
  existingDoses: Array<ImmunizationDoseData>; // Lista de dosis administradas al paciente.
};

// Representa un plan predefinido de vacunación (e.g., Esquema Nacional)
export type VaccinationPlanData = {
  planName: string; // Nombre del plan de vacunación (e.g., "Esquema Nacional de Vacunación").
  planUuid: string; // UUID único del plan.
  plannedSequences: Array<{
    sequenceLabel: string; // Nombre o etiqueta de la secuencia (e.g., "Dosis 1").
    sequenceNumber: number; // Número de secuencia.
    targetAge: {
      value: number; // Edad objetivo para la secuencia.
      unit: 'days' | 'months' | 'years'; // Unidad de tiempo.
    };
  }>;
};

// Representa una recomendación específica para un paciente
export type FHIRImmunizationRecommendation = {
  resourceType: 'ImmunizationRecommendation';
  id: string; // ID único del recurso
  patient: FHIRReference; // Referencia al paciente
  recommendation: Array<{
    vaccineCode: {
      coding: Array<FHIRCode>; // Código de la vacuna recomendada
    };
    targetDisease?: Array<FHIRCode>; // Enfermedades objetivo
    forecastStatus: FHIRCode; // Estado de la recomendación (e.g., "due", "overdue")
    dateCriterion?: Array<{
      code: FHIRCode; // Código que define el criterio (e.g., "earliest date")
      value: string; // Fecha del criterio
    }>;
    supportingImmunization?: Array<FHIRReference>; // Inmunizaciones relacionadas
    supportingPatientInformation?: Array<FHIRReference>; // Información del paciente
  }>;
};

// Entrada del Bundle FHIR de recomendaciones
export type FHIRImmunizationRecommendationBundleEntry = {
  fullUrl: string; // URL completa del recurso
  resource: FHIRImmunizationRecommendation;
};

// Bundle FHIR de recomendaciones de inmunización
export type FHIRImmunizationRecommendationBundle = {
  resourceType: 'Bundle';
  type: 'collection'; // Tipo de Bundle
  entry: Array<FHIRImmunizationRecommendationBundleEntry>;
};

export type SchemasWidgetConfigObject = {
  schemasConceptSet: string;
  sequenceDefinitions: Array<ImmunizationSequenceDefinition>;
};
