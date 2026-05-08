import type { TFunction } from 'i18next';
import type { FulfillerStatus } from '../types';

const humanizeCode = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export function getFulfillerStatusDisplay(status: FulfillerStatus | undefined, t: TFunction): string {
  if (!status) {
    return t('orderNotPicked', 'Order not picked');
  }

  return t(`fulfillerStatus_${status}`, humanizeCode(status));
}

export function getOrderUrgencyDisplay(urgency: string | undefined, t: TFunction): string {
  if (!urgency) {
    return '';
  }

  return t(`orderUrgency_${urgency}`, humanizeCode(urgency));
}
