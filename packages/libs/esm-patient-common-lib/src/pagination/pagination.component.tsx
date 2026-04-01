import { Pagination } from '@carbon/react';
import { ConfigurableLink, useLayoutType } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './pagination.scss';
import { usePaginationInfo } from './usePaginationInfo';

interface PatientChartPaginationProps {
  currentItems: number;
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageNumberChange?: any;
  dashboardLinkUrl?: string;
  dashboardLinkLabel?: string;
}

export const PatientChartPagination: React.FC<PatientChartPaginationProps> = ({
  totalItems,
  pageSize,
  onPageNumberChange,
  pageNumber,
  dashboardLinkUrl,
  currentItems,
  dashboardLinkLabel: urlLabel,
}) => {
  const { t } = useTranslation('@openmrs/esm-patient-chart-app');
  const { itemsDisplayed, pageSizes } = usePaginationInfo(pageSize, totalItems, pageNumber, currentItems);
  const isTablet = useLayoutType() === 'tablet';

  return (
    <>
      {totalItems > 0 && (
        <div className={isTablet ? styles.tablet : styles.desktop}>
          <div>
            {itemsDisplayed}
            {dashboardLinkUrl && (
              <ConfigurableLink to={dashboardLinkUrl} className={styles.configurableLink}>
                {urlLabel ?? t('seeAll', 'See all')}
              </ConfigurableLink>
            )}
          </div>
          <Pagination
            className={styles.pagination}
            page={pageNumber}
            pageSize={pageSize}
            pageSizes={pageSizes}
            totalItems={totalItems}
            onChange={onPageNumberChange}
            pageRangeText={(_, total) => t('paginationPageText', 'of {{count}} pages', { count: total })}
            size={isTablet ? 'lg' : 'sm'}
          />
        </div>
      )}
    </>
  );
};
