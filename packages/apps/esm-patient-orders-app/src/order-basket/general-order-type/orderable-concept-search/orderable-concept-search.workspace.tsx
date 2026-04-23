import { Button, Search } from '@carbon/react';
import {
  ArrowLeftIcon,
  type DefaultWorkspaceProps,
  ResponsiveWrapper,
  Workspace2,
  useConfig,
  useDebounce,
  useLayoutType,
} from '@openmrs/esm-framework';
import {
  type OrderBasketItem,
  type PatientWorkspace2DefinitionProps,
  launchPatientWorkspace,
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

interface LegacyOrderableConceptSearchWorkspaceProps extends DefaultWorkspaceProps {
  order: OrderBasketItem;
  orderTypeUuid: string;
  orderableConceptClasses: Array<string>;
  orderableConceptSets: Array<string>;
}

type Workspace2OrderableConceptSearchWorkspaceProps = PatientWorkspace2DefinitionProps<
  {
    order: OrderBasketItem;
    orderTypeUuid: string;
    orderableConceptClasses: Array<string>;
    orderableConceptSets: Array<string>;
  },
  object
>;

type OrderableConceptSearchWorkspaceProps =
  | LegacyOrderableConceptSearchWorkspaceProps
  | Workspace2OrderableConceptSearchWorkspaceProps;

function isWorkspace2Props(
  props: OrderableConceptSearchWorkspaceProps,
): props is Workspace2OrderableConceptSearchWorkspaceProps {
  return 'groupProps' in props && 'workspaceProps' in props;
}

export const careSettingUuid = '6f0c9a92-6f24-11e3-af88-005056821db0';

type DrugsOrOrders = Pick<OrderBasketItem, 'action'>;

export function ordersEqual(order1: DrugsOrOrders, order2: DrugsOrOrders) {
  return order1.action === order2.action;
}

const OrderableConceptSearchWorkspace: React.FC<OrderableConceptSearchWorkspaceProps> = (props) => {
  const { t } = useTranslation();
  const { order: initialOrder, orderTypeUuid } = isWorkspace2Props(props) ? props.workspaceProps : props;
  const isTablet = useLayoutType() === 'tablet';
  const { orders } = useOrderBasket<OrderBasketItem>(orderTypeUuid, prepOrderPostData);
  const { patientUuid } = usePatientChartStore(isWorkspace2Props(props) ? props.groupProps.patientUuid : undefined);
  const { orderTypes } = useConfig<ConfigObject>();
  const [currentOrder, setCurrentOrder] = useState(initialOrder);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState(t('searchOrderables', 'Search orderables'));
  const { orderType } = useOrderType(orderTypeUuid);
  const handleSetTitle = useCallback(
    (value: string) => {
      if (isWorkspace2Props(props)) {
        setWorkspaceTitle(value);
      } else {
        props.setTitle(value);
      }
    },
    [props],
  );

  const handleCloseWorkspace = useCallback(
    (options?: Parameters<DefaultWorkspaceProps['closeWorkspace']>[0]) => {
      if (isWorkspace2Props(props)) {
        void props.closeWorkspace({ discardUnsavedChanges: options?.ignoreChanges });
        options?.onWorkspaceClose?.();
      } else {
        props.closeWorkspace(options);
      }
    },
    [props],
  );

  const handleCloseWorkspaceWithSavedChanges = useCallback(() => {
    if (isWorkspace2Props(props)) {
      setHasUnsavedChanges(false);
      void props.closeWorkspace({ discardUnsavedChanges: true });
    } else {
      props.closeWorkspaceWithSavedChanges();
    }
  }, [props]);

  const handlePromptBeforeClosing = useCallback(
    (callback: () => boolean) => {
      if (isWorkspace2Props(props)) {
        setHasUnsavedChanges(callback());
      } else {
        props.promptBeforeClosing(callback);
      }
    },
    [props],
  );

  useEffect(() => {
    if (orderType) {
      handleSetTitle(
        t(`addOrderableForOrderType`, 'Add {{orderTypeDisplay}}', {
          orderTypeDisplay: orderType.display.toLocaleLowerCase(),
        }),
      );
    }
  }, [handleSetTitle, orderType, t]);

  const orderableConceptSets = useMemo(
    () => orderTypes.find((orderType) => orderType.orderTypeUuid === orderTypeUuid).orderableConceptSets,
    [orderTypeUuid, orderTypes],
  );

  const cancelDrugOrder = useCallback(() => {
    handleCloseWorkspace({
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
      closeWorkspaceGroup: false,
    });
  }, [handleCloseWorkspace]);

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

  const content = (
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

  if (isWorkspace2Props(props)) {
    return (
      <Workspace2 title={workspaceTitle} hasUnsavedChanges={hasUnsavedChanges}>
        {content}
      </Workspace2>
    );
  }

  return content;
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
