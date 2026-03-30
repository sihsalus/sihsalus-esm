import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  webPreviewViewReportUrl: {
    _type: Type.String,
    _description:
      'The custom URL that the "View Report" button should open when output format is Web Preview. Use {reportRequestUuid} as placeholder.',
    _default: '',
  },
};

export interface ConfigObject {
  webPreviewViewReportUrl: string;
}
