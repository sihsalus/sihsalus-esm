import { Type } from '@openmrs/esm-framework';

// ===============================
// MAIN CONFIGURATION SCHEMA
// ===============================

export const configSchema = {
  enableFuaApprovalWorkflow: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Habilitar el flujo de aprobación de FUA (Formato Único de Atención)',
  },
  fuaGeneratorEndpoint: {
    _type: Type.String,
    _default: 'http://hii1sc-dev.inf.pucp.edu.pe/services/fua-generator/demo',
    _description: 'URL del endpoint del generador de FUA',
  },
};

export type Config = {
  enableFuaApprovalWorkflow: boolean;
  fuaGeneratorEndpoint: string;
};
