import { Type } from '@openmrs/esm-framework';

// ===============================
// MAIN CONFIGURATION SCHEMA
// ===============================

export const configSchema = {
  dyaku: {
    _type: Type.Object,
    _description: 'Configuración para conectar con el sistema FHIR Dyaku del MINSA',
    _default: {
      fhirBaseUrl: 'https://dyaku.minsa.gob.pe/fhir',
      syncEnabled: true,
      syncBatchSize: 50,
      syncIntervalMinutes: 30,
      identifierSourceUuid: '8549f706-7e85-4c1d-9424-217d50a2988b',
      dniIdentifierTypeUuid: '550e8400-e29b-41d4-a716-446655440001',
      hscIdentifierTypeUuid: '05a29f94-c0ed-11e2-94be-8c13b969e334',
      defaultLocationUuid: '8d6c993e-c2cc-11de-8d13-0010c6dffd0f',
      emailAttributeTypeUuid: 'b2c38640-2603-4629-aebd-3b54f33f1e3a',
      phoneAttributeTypeUuid: '14d4f066-15f5-102d-96e4-000c29c2a5d7',
    },
    fhirBaseUrl: {
      _type: Type.String,
      _description: 'URL base del servidor FHIR de Dyaku',
      _default: 'https://dyaku.minsa.gob.pe/fhir',
    },
    syncEnabled: {
      _type: Type.Boolean,
      _description: 'Habilitar sincronización automática de pacientes desde Dyaku',
      _default: true,
    },
    syncBatchSize: {
      _type: Type.Number,
      _description: 'Número de pacientes a sincronizar por lote',
      _default: 50,
    },
    syncIntervalMinutes: {
      _type: Type.Number,
      _description: 'Intervalo en minutos para sincronización automática',
      _default: 30,
    },
    identifierSourceUuid: {
      _type: Type.String,
      _description: 'UUID del IdGen source para generar identificadores automáticos',
      _default: '8549f706-7e85-4c1d-9424-217d50a2988b',
    },
    dniIdentifierTypeUuid: {
      _type: Type.String,
      _description: 'UUID del tipo de identificador para DNI peruano',
      _default: '550e8400-e29b-41d4-a716-446655440001',
    },
    hscIdentifierTypeUuid: {
      _type: Type.String,
      _description: 'UUID del tipo de identificador HSC (identificador principal auto-generado)',
      _default: '05a29f94-c0ed-11e2-94be-8c13b969e334',
    },
    defaultLocationUuid: {
      _type: Type.String,
      _description: 'UUID de la ubicación por defecto (fallback cuando no se puede obtener dinámicamente)',
      _default: '8d6c993e-c2cc-11de-8d13-0010c6dffd0f',
    },
    emailAttributeTypeUuid: {
      _type: Type.String,
      _description: 'UUID del tipo de atributo de persona para email',
      _default: 'b2c38640-2603-4629-aebd-3b54f33f1e3a',
    },
    phoneAttributeTypeUuid: {
      _type: Type.String,
      _description: 'UUID del tipo de atributo de persona para teléfono',
      _default: '14d4f066-15f5-102d-96e4-000c29c2a5d7',
    },
  },
};

export interface ConfigObject {
  dyaku: {
    fhirBaseUrl: string;
    syncEnabled: boolean;
    syncBatchSize: number;
    syncIntervalMinutes: number;
    identifierSourceUuid: string;
    dniIdentifierTypeUuid: string;
    hscIdentifierTypeUuid: string;
    defaultLocationUuid: string;
    emailAttributeTypeUuid: string;
    phoneAttributeTypeUuid: string;
  };
}
