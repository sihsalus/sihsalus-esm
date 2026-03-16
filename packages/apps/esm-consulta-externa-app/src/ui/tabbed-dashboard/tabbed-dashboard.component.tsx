// ../ui/tabbed-dashboard/tabbed-dashboard.component.tsx
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Extension, ExtensionSlot } from '@openmrs/esm-framework';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import styles from './tabbed-dashboard.scss';

export interface TabConfig {
  labelKey: string;
  icon: React.ComponentType;
  slotName: string;
}

interface TabbedDashboardProps {
  patient: fhir.Patient;
  patientUuid: string;
  titleKey: string;
  tabs: TabConfig[];
  ariaLabelKey: string;
  pageSize?: number;
  className?: string;
  state?: Record<string, any>;
}

const TabbedDashboard: React.FC<TabbedDashboardProps> = ({
  patient,
  patientUuid,
  titleKey,
  tabs,
  ariaLabelKey,
  pageSize = 5,
  className,
  state = {},
}) => {
  const { t } = useTranslation();

  const translatedTabs = useMemo(() => tabs.map((tab) => ({ ...tab, label: t(tab.labelKey) })), [tabs, t]);

  return (
    <div className={classNames(styles.widgetCard, className)}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t(titleKey)}</h4>
          </div>
        </Tile>
      </Layer>
      <Layer>
        <Tabs>
          <TabList className={styles.tabList} aria-label={t(ariaLabelKey)}>
            {translatedTabs.map((tab, index) => (
              <Tab className={styles.tab} key={index} renderIcon={tab.icon}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {translatedTabs.map((tab, index) => (
              <TabPanel key={index} className={styles.dashboardContainer}>
                <div className={styles.dashboardContainer}>
                  <ExtensionSlot key={tab.slotName} name={tab.slotName} className={styles.dashboard}>
                    {(extension) => (
                      <div className={styles.extension}>
                        <Extension
                          state={{
                            patient,
                            patientUuid,
                            pageSize,
                            extensionId: extension.id,
                            ...state, // Merge custom state
                          }}
                          className={styles.extensionWrapper}
                        />
                      </div>
                    )}
                  </ExtensionSlot>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default TabbedDashboard;
