import { ConfigurableLink } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StockManagementAppMenuLink() {
  const { t } = useTranslation();
  return (
    <ConfigurableLink to={`${globalThis.spaBase}/stock-management`}>
      {t('stockManagement', 'Gestión de Inventario')}
    </ConfigurableLink>
  );
}
