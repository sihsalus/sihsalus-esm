import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  costStructureApiPath: {
    _type: Type.String,
    _default: 'ws/module/coststructure',
    _description: 'Ruta base del API del módulo de estructura de costos.',
  },
};

export type Config = {
  costStructureApiPath: string;
};
