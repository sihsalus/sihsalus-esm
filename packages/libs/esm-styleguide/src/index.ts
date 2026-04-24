import { defineConfigSchema, getSyncLifecycle, registerModal } from '@openmrs/esm-framework/src/internal';
import { setupBranding } from './brand';
import { esmStyleGuideSchema } from './config-schema';
import { setupEmptyCard } from './empty-card/empty-card-registration';
import { setupIcons } from './icons/icon-registration';
import { setupLogo } from './logo';
import { setupPictograms } from './pictograms/pictogram-registration';
import Workspace2ClosePromptModal from './workspaces2/workspace2-close-prompt.modal';

defineConfigSchema('@openmrs/esm-styleguide', esmStyleGuideSchema);
setupBranding();
setupLogo();
setupIcons();
setupPictograms();
setupEmptyCard();

registerModal({
  name: 'workspace2-close-prompt',
  moduleName: '@openmrs/esm-styleguide',
  load: getSyncLifecycle(Workspace2ClosePromptModal, {
    featureName: 'workspace2-close-prompt',
    moduleName: '@openmrs/esm-styleguide',
  }),
});
