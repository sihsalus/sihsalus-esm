import { Type } from '@openmrs/esm-framework';

export const configSchema = {
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
  baseEncounterTypeUuid: string;
  attentionEncounterTypeUuid: string;
  findingConceptUuid?: string;
  findingConceptUuids?: Record<string, string>;
}
