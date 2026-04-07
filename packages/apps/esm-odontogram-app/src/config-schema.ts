import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  encounterTypeUuid: {
    _type: Type.UUID,
    _description: 'UUID of the ODONTOGRAM encounter type',
    _default: '',
  },
  findingConceptUuid: {
    _type: Type.UUID,
    _description: 'UUID of the parent concept for dental findings (obs concept)',
    _default: '',
  },
};

export interface OdontogramConfig {
  encounterTypeUuid: string;
  findingConceptUuid: string;
}
