import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import OclErrorBoundary from './error-boundary.component';
import Import from './import/import.component';
import PreviousImports from './previous-imports/previous-imports.component';
import styles from './root.scss';
import Subscription from './subscription/subscription.component';

const Root: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AppErrorBoundary appName="esm-openconceptlab-app">
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
              <OclErrorBoundary headerTitle="Subscription">
                <Subscription />
              </OclErrorBoundary>
            </TabPanel>
            <TabPanel className={styles.tabPanel}>
              <OclErrorBoundary headerTitle="Import">
                <Import />
              </OclErrorBoundary>
            </TabPanel>
            <TabPanel className={styles.tabPanel}>
              <OclErrorBoundary headerTitle="Previous Imports">
                <PreviousImports />
              </OclErrorBoundary>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
    </AppErrorBoundary>
  );
};

export default Root;
