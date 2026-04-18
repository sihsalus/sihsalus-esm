import { type OpenmrsResource } from '@openmrs/esm-framework';
import { type FormFieldValueAdapter, type FormProcessorContextProps, type Order, type ValueAndDisplay } from '..';
import { type FormContextProps } from '../provider/form-provider';
import { type FormField } from '../types';
import {
  clearSubmission,
  getResourceUuid,
  gracefullySetSubmission,
  isPlainObject,
  isStringValue,
} from '../utils/common-utils';

export let assignedOrderIds: string[] = [];
const defaultOrderType = 'testorder';
const defaultCareSetting = '6f0c9a92-6f24-11e3-af88-005056821db0';

export const OrdersAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: unknown, context: FormContextProps): Order | null {
    if (context.sessionMode == 'edit' && field.meta.initialValue?.omrsObject) {
      return editOrder(value, field, context.currentProvider.uuid);
    }
    const newValue = constructNewOrder(value, field, context.currentProvider.uuid);
    gracefullySetSubmission(field, newValue, undefined);
    return newValue;
  },
  getInitialValue: function (
    field: FormField,
    sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): string | null {
    const availableOrderables = field.questionOptions.answers?.map((answer) => answer.concept) || [];
    const orders = getOrders(sourceObject);
    const matchedOrder = orders
      .filter((order) => !assignedOrderIds.includes(order.uuid ?? '') && !order.voided)
      .find((order) => {
        const conceptUuid = getResourceUuid(order.concept);
        return typeof conceptUuid === 'string' && availableOrderables.includes(conceptUuid);
      });
    if (matchedOrder) {
      const conceptUuid = getResourceUuid(matchedOrder.concept);
      field.meta = {
        ...(field.meta || {}),
        initialValue: {
          omrsObject: matchedOrder,
          refinedValue: conceptUuid ?? null,
        },
      };
      if (matchedOrder.uuid) {
        assignedOrderIds.push(matchedOrder.uuid);
      }
      return conceptUuid ?? null;
    }
    return null;
  },
  getPreviousValue: function (
    _field: FormField,
    _sourceObject: OpenmrsResource,
    _context: FormProcessorContextProps,
  ): ValueAndDisplay | null {
    return null;
  },
  getDisplayValue: (field: FormField, value: unknown): unknown => {
    return field.questionOptions.answers?.find((option) => option.concept == value)?.label || value;
  },
  tearDown: function (): void {
    assignedOrderIds = [];
  },
};

function constructNewOrder(value: unknown, field: FormField, orderer: string): Order | null {
  if (!isStringValue(value) || !value) {
    return null;
  }
  return {
    action: 'NEW',
    concept: value,
    type: field?.questionOptions?.orderType || defaultOrderType,
    careSetting: field?.questionOptions?.orderSettingUuid || defaultCareSetting,
    orderer: orderer,
  };
}

function editOrder(newOrder: unknown, field: FormField, orderer: string): Order | null {
  const previousOrder = getOrderResource(field.meta.initialValue?.omrsObject);
  const previousConceptUuid = previousOrder ? getResourceUuid(previousOrder.concept) : undefined;
  if (!isStringValue(newOrder) || newOrder === previousConceptUuid) {
    clearSubmission(field);
    return null;
  }
  const voided = {
    uuid: previousOrder?.uuid,
    voided: true,
  };
  gracefullySetSubmission(field, constructNewOrder(newOrder, field, orderer), voided);
  return (field.meta.submission.newValue as Order | undefined) ?? null;
}

function getOrders(sourceObject: OpenmrsResource): Order[] {
  return isPlainObject(sourceObject) && Array.isArray((sourceObject as unknown as { orders?: Order[] }).orders)
    ? (sourceObject as unknown as { orders: Order[] }).orders
    : [];
}

function getOrderResource(value: unknown): Order | null {
  return isPlainObject(value) ? (value as unknown as Order) : null;
}
