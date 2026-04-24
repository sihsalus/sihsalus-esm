import { Button } from '@carbon/react';
import { ArrowLeftIcon, useLayoutType, useSession, Workspace2 } from '@openmrs/esm-framework';
import {
  type DefaultPatientWorkspaceProps,
  launchPatientWorkspace,
  type PatientWorkspace2DefinitionProps,
  useOrderBasket,
} from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { careSettingUuid, prepMedicationOrderPostData } from '../api/api';
import type { DrugOrderBasketItem } from '../types';

import styles from './add-drug-order.scss';
import { DrugOrderForm } from './drug-order-form.component';
import DrugSearch from './drug-search/drug-search.component';
import { ordersEqual } from './drug-search/helpers';

export interface AddDrugOrderWorkspaceAdditionalProps {
  order: DrugOrderBasketItem;
}

export interface AddDrugOrderWorkspaceProps
  extends DefaultPatientWorkspaceProps,
    AddDrugOrderWorkspaceAdditionalProps {}

type Workspace2AddDrugOrderWorkspaceProps = PatientWorkspace2DefinitionProps<
  AddDrugOrderWorkspaceAdditionalProps,
  object
>;
type AddDrugOrderWorkspaceComponentProps = AddDrugOrderWorkspaceProps | Workspace2AddDrugOrderWorkspaceProps;

function isWorkspace2Props(props: AddDrugOrderWorkspaceComponentProps): props is Workspace2AddDrugOrderWorkspaceProps {
  return 'groupProps' in props && 'workspaceProps' in props;
}

export default function AddDrugOrderWorkspace(props: AddDrugOrderWorkspaceComponentProps) {
  const initialOrder = isWorkspace2Props(props) ? props.workspaceProps?.order : props.order;
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { orders, setOrders } = useOrderBasket<DrugOrderBasketItem>('medications', prepMedicationOrderPostData);
  const [currentOrder, setCurrentOrder] = useState(initialOrder);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const session = useSession();

  const returnToOrderBasket = useCallback(
    async (discardUnsavedChanges?: boolean) => {
      if (isWorkspace2Props(props)) {
        await props.closeWorkspace({ discardUnsavedChanges });
        return;
      }

      props.closeWorkspace({
        ignoreChanges: discardUnsavedChanges,
        onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
        closeWorkspaceGroup: false,
      });
    },
    [props],
  );

  const closeWorkspaceWithSavedChanges = useCallback(async () => {
    if (isWorkspace2Props(props)) {
      setHasUnsavedChanges(false);
      await props.closeWorkspace({ discardUnsavedChanges: true });
      return;
    }

    props.closeWorkspaceWithSavedChanges({
      onWorkspaceClose: () => launchPatientWorkspace('order-basket'),
    });
  }, [props]);

  const promptBeforeClosing = useCallback((testFcn: () => boolean) => setHasUnsavedChanges(testFcn()), []);

  const cancelDrugOrder = useCallback(() => {
    void returnToOrderBasket(true);
  }, [returnToOrderBasket]);

  const openOrderForm = useCallback(
    (searchResult: DrugOrderBasketItem) => {
      const existingOrder = orders.find((order) => ordersEqual(order, searchResult));
      if (existingOrder) {
        setCurrentOrder(existingOrder);
      } else {
        setCurrentOrder(searchResult);
      }
    },
    [orders],
  );

  const saveDrugOrder = useCallback(
    (finalizedOrder: DrugOrderBasketItem) => {
      finalizedOrder.careSetting = careSettingUuid;
      finalizedOrder.orderer = session.currentProvider.uuid;
      const newOrders = [...orders];
      const existingOrder = orders.find((order) => ordersEqual(order, finalizedOrder));
      if (existingOrder) {
        newOrders[orders.indexOf(existingOrder)] = {
          ...finalizedOrder,
          // Incomplete orders should be marked completed on saving the form
          isOrderIncomplete: false,
        };
      } else {
        newOrders.push(finalizedOrder);
      }
      setOrders(newOrders);
      void closeWorkspaceWithSavedChanges();
    },
    [orders, setOrders, closeWorkspaceWithSavedChanges, session.currentProvider.uuid],
  );

  const content = !currentOrder ? (
    <>
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
      <DrugSearch openOrderForm={openOrderForm} returnToOrderBasket={() => void returnToOrderBasket(true)} />
    </>
  ) : (
    <DrugOrderForm
      initialOrderBasketItem={currentOrder}
      onSave={saveDrugOrder}
      onCancel={cancelDrugOrder}
      promptBeforeClosing={promptBeforeClosing}
    />
  );

  if (isWorkspace2Props(props)) {
    return (
      <Workspace2 title={t('addDrugOrderWorkspaceTitle', 'Add drug order')} hasUnsavedChanges={hasUnsavedChanges}>
        {content}
      </Workspace2>
    );
  }

  return content;
}
