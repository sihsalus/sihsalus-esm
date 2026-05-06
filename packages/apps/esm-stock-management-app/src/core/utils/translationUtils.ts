import { type TFunction } from 'i18next';

export function translateStockOperationType(t: TFunction, operationTypeName?: string) {
  return operationTypeName ? t(`operationType.${operationTypeName}`, operationTypeName) : '';
}

export function translateStockLocation(t: TFunction, locationName?: string) {
  return locationName ? t(`location.${locationName}`, locationName) : '';
}
