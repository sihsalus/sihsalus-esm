import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { Layer, Tile } from '@carbon/react';
import styles from './tabbed-dashboard.scss';

export interface TabConfig {
  labelKey: string;
  icon: React.ComponentType<Record<string, unknown>>;
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
  const [activeTab, setActiveTab] = useState(0);

  const translatedTabs = useMemo(() => tabs.map((tab) => ({ ...tab, label: t(tab.labelKey) })), [tabs, t]);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowRight') {
        setActiveTab((index + 1) % tabs.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveTab((index - 1 + tabs.length) % tabs.length);
      }
    },
    [tabs.length],
  );

  return (
    <div className={classNames(styles.widgetCard, className)}>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t(titleKey)}</h4>
          </div>
        </Tile>
      </Layer>
      <div
        className={styles.tabBar}
        role="tablist"
        aria-label={t(ariaLabelKey)}
      >
        {translatedTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeTab;
          return (
            <button
              key={index}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={classNames(styles.tabButton, { [styles.tabButtonActive]: isActive })}
              onClick={() => handleTabClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {Icon && <Icon size={16} className={styles.tabIcon} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        className={styles.dashboardContainer}
        aria-labelledby={`tab-${activeTab}`}
      >
        <ExtensionSlot
          key={translatedTabs[activeTab]?.slotName}
          name={translatedTabs[activeTab]?.slotName}
          className={styles.dashboard}
          state={{
            patient,
            patientUuid,
            pageSize,
            ...state,
          }}
        />
      </div>
    </div>
  );
};

export default TabbedDashboard;
