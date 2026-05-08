import { Search } from '@carbon/react';
import { AssignedExtension, Extension, ExtensionSlot, useConnectedExtensions } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './app-module-switcher.scss';

const AppModuleSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const extensions = useConnectedExtensions('app-menu-item-slot') as AssignedExtension[];

  const filtered = searchTerm
    ? extensions.filter((ext) => ext.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : extensions;

  return (
    <div className={styles.overlay}>
      <Search
        autoFocus
        className={styles.searchInput}
        closeButtonLabelText={t('clear', 'Borrar')}
        labelText=""
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder={t('searchModule', 'Buscar módulo...')}
        size="lg"
        value={searchTerm}
      />
      <div className={styles.cardGrid}>
        {filtered.map((ext) => (
          <ComponentContext.Provider
            key={ext.id}
            value={{
              moduleName: ext.moduleName,
              extension: {
                extensionId: ext.id,
                extensionSlotName: 'app-menu-item-slot',
                extensionSlotModuleName: ext.moduleName,
              },
            }}
          >
            <Extension />
          </ComponentContext.Provider>
        ))}
      </div>
      <ExtensionSlot className={styles.textLinks} name="app-menu-slot" />
    </div>
  );
};

export default AppModuleSwitcher;
