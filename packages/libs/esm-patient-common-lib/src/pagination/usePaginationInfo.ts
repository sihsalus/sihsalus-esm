import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function usePaginationInfo(pageSize: number, totalItems: number, pageNumber: number, currentItems: number) {
  const { t } = useTranslation('@sihsalus/esm-patient-chart-app');

  const pageSizes = useMemo(() => {
    let numberOfPages = Math.ceil(totalItems / pageSize);
    if (isNaN(numberOfPages)) {
      numberOfPages = 0;
    }

    return [...Array(numberOfPages).keys()].map((x) => {
      return (x + 1) * pageSize;
    });
  }, [pageSize, totalItems]);

  const itemsDisplayed = useMemo(() => {
    const pageItemsCount =
      pageSize > totalItems
        ? totalItems
        : pageSize * pageNumber > totalItems
          ? pageSize * (pageNumber - 1) + currentItems
          : pageSize * pageNumber;

    return t('paginationItemsCount', `{{pageItemsCount}} / {{count}} items`, { count: totalItems, pageItemsCount });
  }, [pageSize, totalItems, pageNumber, currentItems, t]);

  return {
    pageSizes,
    itemsDisplayed,
  };
}
