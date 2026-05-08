import { type TFunction } from 'i18next';

export function translateStockOperationType(t: TFunction, operationTypeName?: string) {
  return operationTypeName ? t(`operationType.${operationTypeName}`, operationTypeName) : '';
}

export function translateStockLocation(t: TFunction, locationName?: string) {
  return locationName ? t(`location.${locationName}`, locationName) : '';
}

export function translateFromGlobal(key: string, defaultValue: string) {
  const i18next = (
    globalThis as typeof globalThis & {
      i18next?: { t?: (key: string, options?: { defaultValue?: string }) => string };
    }
  ).i18next;

  return i18next?.t?.(key, { defaultValue }) ?? defaultValue;
}
