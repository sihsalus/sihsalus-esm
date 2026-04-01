export interface ReportDefinition {
  uuid: string;
  name: string;
  description: string;
  parameters: ReportParameter[];
}

export interface ReportParameter {
  name: string;
  label: string;
  type: string;
  required: boolean;
}
