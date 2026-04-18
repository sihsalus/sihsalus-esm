import { Button, Search } from '@carbon/react';
import {
  ArrowLeftIcon,
  ResponsiveWrapper,
  useConfig,
  useDebounce,
  useLayoutType,
  type DefaultWorkspaceProps,
} from '@openmrs/esm-framework';
import {
  launchPatientWorkspace,
  type OrderBasketItem,
  useOrderBasket,
  useOrderType,
  usePatientChartStore,
} from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type ConfigObject } from '../../../config-schema';
import { OrderForm } from '../general-order-form/general-order-form.component';
import { prepOrderPostData } from '../resources';

import styles from './orderable-concept-search.scss';
import OrderableConceptSearchResults from './search-results.component';

interface OrderableConceptSearchWorkspaceProps extends DefaultWorkspaceProps {
  order: OrderBasketItem;
  orderTypeUuid: string;
  orderableConceptClasses: Array<string>;
  orderableConceptSets: Array<string>;
}

export const careSettingUuid = '6f0c9a92-6f24-11e3-af88-005056821db0';

type DrugsOrOrders = Pick<OrderBasketItem, 'action'>;

export function ordersEqual(order1: DrugsOrOrders, order2: DrugsOrOrders) {
  return order1.action === order2.action;
}

const OrderableConceptSearchWorkspace: React.FC<OrderableConceptSearchWorkspaceProps> = (props) => {
  const { t } = useTranslation();
  const { order: initialOrder, orderTypeUuid } = props;
  const isTablet = useLayoutType() === 'tablet';
  const { orders } = useOrderBasket<OrderBasketItem>(orderTypeUuid, prepOrderPostData);
  const { patientUuid } = usePatientChartStore();
  const { orderTypes } = useConfig<ConfigObject>();
  const [currentOrder, setCurrentOrder] = useState(initialOrder);
  const { orderType } = useOrderType(orderTypeUuid);
  const handleSetTitle = useCallback(
    (value: string) => {
      props.setTitle(value);
    },
    [props],
  );

  const handleCloseWorkspace = useCallback(
    (options?: Parameters<DefaultWorkspaceProps['closeWorkspace']>[0]) => {
      props.closeWorkspace(options);
    },
    [props],
  );

  const handleCloseWorkspaceWithSavedChanges = useCallback(() => {
    props.closeWorkspaceWithSavedChanges();
  }, [props]);

  const handlePromptBeforeClosing = useCallback(
    (callback: () => boolean) => {
      props.promptBeforeClosing(callback);
    },
    [props],
  );

  useEffect(() => {
    if (orderType) {
      props.setTitle(
        t(`addOrderableForOrderType`, 'Add {{orderTypeDisplay}}', {
          orderTypeDisplay: orderType.display.toLocaleLowerCase(),
        }),
      );
    }
  }, [orderType, props, t]);

  const orderableConceptSets = useMemo(
    () => orderTypes.find((orderType) => orderType.orderTypeUuid === orderTypeUuid).orderableConceptSets,
    [orderTypeUuid, orderTypes],
  );

  const cancelDrugOrder = useCallback(() => {
    props.closeWorkspace({
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
      closeWorkspaceGroup: false,
    });
  }, [props]);

  const openOrderForm = useCallback(
    (order: OrderBasketItem) => {
      const existingOrder = orders.find((prevOrder) => ordersEqual(prevOrder, order));
      if (existingOrder) {
        setCurrentOrder(existingOrder);
      } else {
        setCurrentOrder(order);
      }
    },
    [orders],
  );

  return (
    <div className={styles.workspaceWrapper}>
      {!isTablet && (
        <div className={styles.backButton}>
          <Button
            iconDescription="Return to order basket"
            kind="ghost"
            onClick={cancelDrugOrder}
            renderIcon={(props: ComponentProps<typeof ArrowLeftIcon>) => <ArrowLeftIcon size={24} {...props} />}
            size="sm"
          >
            <span>{t('backToOrderBasket', 'Back to order basket')}</span>
          </Button>
        </div>
      )}
      {currentOrder ? (
        <OrderForm
          initialOrder={currentOrder}
          closeWorkspace={handleCloseWorkspace}
          closeWorkspaceWithSavedChanges={handleCloseWorkspaceWithSavedChanges}
          promptBeforeClosing={handlePromptBeforeClosing}
          orderTypeUuid={orderTypeUuid}
          orderableConceptSets={orderableConceptSets}
          patientUuid={patientUuid}
          setTitle={handleSetTitle}
        />
      ) : (
        <ConceptSearch
          openOrderForm={openOrderForm}
          closeWorkspace={handleCloseWorkspace}
          orderableConceptSets={orderableConceptSets}
          orderTypeUuid={orderTypeUuid}
        />
      )}
    </div>
  );
};

interface ConceptSearchProps {
  closeWorkspace: DefaultWorkspaceProps['closeWorkspace'];
  openOrderForm: (search: OrderBasketItem) => void;
  orderTypeUuid: string;
  orderableConceptSets: Array<string>;
}

function ConceptSearch({ closeWorkspace, orderTypeUuid, openOrderForm, orderableConceptSets }: ConceptSearchProps) {
  const { t } = useTranslation();
  const { orderType } = useOrderType(orderTypeUuid);
  const isTablet = useLayoutType() === 'tablet';
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const cancelDrugOrder = useCallback(() => {
    closeWorkspace({
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
    });
  }, [closeWorkspace]);

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
          placeholder={t('searchFieldOrder', 'Search for {{orderType}} order', {
            orderType: orderType?.display ?? '',
          })}
          labelText={t('searchFieldOrder', 'Search for {{orderType}} order', {
            orderType: orderType?.display ?? '',
          })}
          onChange={handleSearchTermChange}
          ref={searchInputRef}
          value={searchTerm}
        />
      </ResponsiveWrapper>
      <OrderableConceptSearchResults
        searchTerm={debouncedSearchTerm}
        openOrderForm={openOrderForm}
        focusAndClearSearchInput={focusAndClearSearchInput}
        closeWorkspace={closeWorkspace}
        orderTypeUuid={orderTypeUuid}
        cancelOrder={() => {}}
        orderableConceptSets={orderableConceptSets}
      />
      {isTablet && (
        <div className={styles.separatorContainer}>
          <p className={styles.separator}>{t('or', 'or')}</p>
          <Button iconDescription="Return to order basket" kind="ghost" onClick={cancelDrugOrder}>
            {t('returnToOrderBasket', 'Return to order basket')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default OrderableConceptSearchWorkspace;
