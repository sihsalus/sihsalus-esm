import { openmrsFetch, restBaseUrl, showSnackbar } from '@openmrs/esm-framework';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Shows a snackbar notification listing lab orders that were submitted
 * as part of a form encounter.
 */
export function useLabOrderNotification() {
  const { t } = useTranslation();

  const showLabOrdersNotification = useCallback(
    async (encounterUuid: string) => {
      if (!encounterUuid) return;

      try {
        const response = await openmrsFetch(
          `${restBaseUrl}/encounter/${encounterUuid}?v=custom:(uuid,orders:(uuid,display,orderNumber,auditInfo:(dateVoided)))`,
        );

        const orders = response.data?.orders?.filter(
          (order: any) => !order.auditInfo?.dateVoided,
        );

        if (orders?.length) {
          const orderList = orders
            .map((order: any, i: number) => `${i + 1}. ${order.display} (${order.orderNumber})`)
            .join(', ');

          showSnackbar({
            title: t('labOrdersGenerated', 'Lab order(s) generated'),
            subtitle: orderList,
            kind: 'success',
            isLowContrast: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch lab orders for notification:', error);
      }
    },
    [t],
  );

  return { showLabOrdersNotification };
}
