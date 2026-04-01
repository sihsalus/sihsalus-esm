import { ConfigurableLink } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { spaBasePath } from './constants';

export default function SystemAdminAppMenuLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to={spaBasePath}>{t('systemAdmin', 'System Administration')}</ConfigurableLink>;
}
