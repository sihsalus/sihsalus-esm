import { getAsyncLifecycle, getSyncLifecycle, defineConfigSchema } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { dashboardMeta } from './dashboard.meta';
import { configSchema } from './config-schema';
import ImagingDetailedSummaryComponent from './imaging/imaging-summary/imaging-detailed-summary.component';

const moduleName = '@openmrs/esm-patient-imaging-app';

const options = {
  featureName: 'patient-imaging',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const imagingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    moduleName,
  }),
  options,
);

export const uploadStudiesFormWorkspace = getAsyncLifecycle(
  () => import('./imaging/studies/upload-studies.workspace'),
  options,
);

export const linkStudiesFormWorkspace = getAsyncLifecycle(
  () => import('./imaging/studies/link-studies.workspace'),
  options,
);

export const assignStudiesFormWorkspace = getAsyncLifecycle(
  () => import('./imaging/studies/assign-studies.workspace'),
  options,
);

export const addNewRequestWorkspace = getAsyncLifecycle(
  () => import('./imaging/worklist/add-request-form.workspace'),
  options,
);

export const addNewProcedureStepWorkspace = getAsyncLifecycle(
  () => import('./imaging/worklist/add-procedureStep-form.workspace'),
  options,
);

export const studyDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./imaging/components/delete-study.modal'),
  options,
);

export const seriesDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./imaging/components/delete-series.modal'),
  options,
);

export const requestDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./imaging/components/delete-request.modal'),
  options,
);

export const procedureSteptDeleteConfirmationDialog = getAsyncLifecycle(
  () => import('./imaging/components/delete-procedureStep.modal'),
  options,
);

export const instancePreviewDialog = getAsyncLifecycle(
  () => import('./imaging/components/instance-preview.modal'),
  options,
);

export const imagingDetailedSummary = getSyncLifecycle(ImagingDetailedSummaryComponent, options);

export function createErrorHandler() {
  const outgoingErr = Error();
  return (incomingErr) => {
    const finalErr = ensureErrorObject(incomingErr);
    finalErr.stack += `\nAsync stacktrace:\n${outgoingErr.stack}`;
    reportError(incomingErr);
  };
}

function ensureErrorObject(thing: any) {
  let message;

  if (thing instanceof Error) {
    return thing;
  } else if (thing === null) {
    return Error(`'null' was thrown as an error`);
  } else if (typeof thing === 'object') {
    try {
      message = `Object thrown as error: ${JSON.stringify(thing)}`;
    } catch (e) {
      message = `Object thrown as error with the following properties: ${Object.keys(thing)}`;
    }
    return Error(message);
  } else if (thing === undefined) {
    return Error(`'undefined' was thrown as an error`);
  } else {
    return Error(thing.toString());
  }
}
