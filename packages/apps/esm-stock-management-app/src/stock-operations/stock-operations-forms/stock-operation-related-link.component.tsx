import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStockOperationTypes } from '../../stock-lookups/stock-lookups.resource';
import { launchStockoperationAddOrEditWorkSpace } from '../stock-operation.utils';
import { useStockOperationAndItems } from '../stock-operations.resource';

interface StockOperationRelatedLinkProps {
  stockOperationUuid: string;
  operationNumber: string;
}

const StockOperationRelatedLink: React.FC<StockOperationRelatedLinkProps> = ({
  stockOperationUuid,
  operationNumber,
}) => {
  const { error, isLoading, types } = useStockOperationTypes();
  const {
    error: stockOperationError,
    isLoading: isStockOperationLoading,
    items: stockOperation,
  } = useStockOperationAndItems(stockOperationUuid);
  const { t } = useTranslation();

  const handleEdit = useCallback(() => {
    const operationType = types?.results?.find((op) => op?.uuid === stockOperation?.operationTypeUuid);
    if (!operationType) {
      return;
    }
    launchStockoperationAddOrEditWorkSpace(
      t,
      operationType,
      stockOperation,
      stockOperation?.requisitionStockOperationUuid,
    );
  }, [types, stockOperation, t]);

  if (isLoading || error || stockOperationError || isStockOperationLoading) return null;
  return (
    <button
      type="button"
      onClick={handleEdit}
      style={{
        background: 'none',
        border: 0,
        color: 'inherit',
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'underline',
      }}
    >
      {operationNumber}
    </button>
  );
};

export default StockOperationRelatedLink;
