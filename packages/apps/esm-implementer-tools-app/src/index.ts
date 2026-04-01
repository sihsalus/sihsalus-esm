import { getSyncLifecycle } from '@openmrs/esm-framework';

import globalImplementerToolsComponent from './global-implementer-tools.component';
import implementerToolsButtonComponent from './implementer-tools.button';
import implementerToolsComponent from './implementer-tools.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sihsalus/esm-implementer-tools-app';
const options = {
  featureName: 'Implementer Tools',
  moduleName,
};

export const implementerTools = getSyncLifecycle(implementerToolsComponent, options);

export const globalImplementerTools = getSyncLifecycle(globalImplementerToolsComponent, options);

export const implementerToolsButton = getSyncLifecycle(implementerToolsButtonComponent, options);

export { default as ConfigEditButton } from './config-edit-button/config-edit-button.component';
