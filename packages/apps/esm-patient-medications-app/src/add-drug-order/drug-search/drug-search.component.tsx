import { Button, Search } from '@carbon/react';
import { ResponsiveWrapper, useConfig, useDebounce, useLayoutType } from '@openmrs/esm-framework';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type ConfigObject } from '../../config-schema';
import { type DrugOrderBasketItem } from '../../types';
import styles from './order-basket-search.scss';
import OrderBasketSearchResults from './order-basket-search-results.component';

export interface DrugSearchProps {
  openOrderForm: (searchResult: DrugOrderBasketItem) => void;
  returnToOrderBasket: () => void;
}

export default function DrugSearch({ openOrderForm, returnToOrderBasket }: DrugSearchProps) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const [searchTerm, setSearchTerm] = useState('');
  const { debounceDelayInMs } = useConfig<ConfigObject>();
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelayInMs ?? 300);
  const searchInputRef = useRef(null);

  const focusAndClearSearchInput = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value ?? '');

  return (
    <div className={styles.searchPopupContainer}>
      <ResponsiveWrapper>
        <Search
          autoFocus
          size="lg"
          placeholder={t('searchFieldPlaceholder', 'Search for a drug or orderset (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for a drug or orderset (e.g. "Aspirin")')}
          onChange={handleSearchTermChange}
          ref={searchInputRef}
          value={searchTerm}
        />
      </ResponsiveWrapper>
      <OrderBasketSearchResults
        searchTerm={debouncedSearchTerm}
        openOrderForm={openOrderForm}
        focusAndClearSearchInput={focusAndClearSearchInput}
        returnToOrderBasket={returnToOrderBasket}
      />
      {isTablet && (
        <div className={styles.separatorContainer}>
          <p className={styles.separator}>{t('or', 'or')}</p>
          <Button iconDescription="Return to order basket" kind="ghost" onClick={returnToOrderBasket}>
            {t('returnToOrderBasket', 'Return to order basket')}
          </Button>
        </div>
      )}
    </div>
  );
}
