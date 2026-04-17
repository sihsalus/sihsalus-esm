declare module '@openmrs/esm-patient-common-lib' {
  export const clinicalFormsWorkspace: string;
  export function launchPatientWorkspace(workspaceName: string): Promise<void>;
}
