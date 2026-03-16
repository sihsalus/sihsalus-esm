import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  indicatorsApiPath: {
    _type: Type.String,
    _default: '/ws/module/indicators/api',
    _description: 'Ruta base del API del módulo de indicadores clínicos.',
  },
};

export type Config = {
  indicatorsApiPath: string;
};
