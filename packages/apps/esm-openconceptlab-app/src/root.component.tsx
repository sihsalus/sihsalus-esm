import React from 'react';
import classNames from 'classnames';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import Import from './import/import.component';
import PreviousImports from './previous-imports/previous-imports.component';
import Subscription from './subscription/subscription.component';
import styles from './root.scss';

const Root: React.FC = () => {
  const { t } = useTranslation();
  return (
    <main className={classNames('omrs-main-content', styles.main)}>
      <h3 className={styles.moduleHeader}>{t('moduleTitle', 'OCL Subscription Module')}</h3>
      <Tabs>
        <TabList aria-label="OCL tabs" className={styles.tabList} contained>
          <Tab>{t('subscription', 'Subscription')} </Tab>
          <Tab>{t('import', 'Import')} </Tab>
          <Tab>{t('previousImports', 'Previous Imports')} </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className={styles.tabPanel}>
            <Subscription />
          </TabPanel>
          <TabPanel className={styles.tabPanel}>
            <Import />
          </TabPanel>
          <TabPanel className={styles.tabPanel}>
            <PreviousImports />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </main>
  );
};

export default Root;
