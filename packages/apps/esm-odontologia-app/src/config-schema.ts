import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  dentalEncounterTypeUuid: {
    _type: Type.UUID,
    _description: 'UUID of the encounter type for atención odontológica',
    _default: '1a58800e-dc0d-49b3-abfa-5da144e08d00',
  },
  dentalFormUuid: {
    _type: Type.UUID,
    _description: 'UUID of the form for atención odontológica',
    _default: '32e43fc9-6de3-48e3-aafe-3b92f167753d',
  },
  baseEncounterTypeUuid: {
    _type: Type.UUID,
    _description: 'UUID of the encounter type for base odontograms (hallazgos)',
    _default: '',
  },
  attentionEncounterTypeUuid: {
    _type: Type.UUID,
    _description: 'UUID of the encounter type for attention odontograms (soluciones)',
    _default: '',
  },
  findingConceptUuid: {
    _type: Type.UUID,
    _description: 'Default UUID of the concept for dental findings (fallback obs concept)',
    _default: '',
  },
  findingConceptUuids: {
    _type: Type.Object,
    _description: 'Optional map of findingId -> concept UUID to store specific obs concept per odontogram finding',
    _default: {},
  },
};

export interface OdontogramConfig {
  dentalEncounterTypeUuid: string;
  dentalFormUuid: string;
  baseEncounterTypeUuid: string;
  attentionEncounterTypeUuid: string;
  findingConceptUuid?: string;
  findingConceptUuids?: Record<string, string>;
}
