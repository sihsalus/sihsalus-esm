import { getGlobalStore, useStore } from '@openmrs/esm-framework';

/**
 * Service Queues Integration Utilities
 * 
 * Utilities to integrate emergency-app with service-queues-app.
 * These functions help emergency components work within the service-queues context
 * by accessing the service-queues store when available.
 * 
 * The store is accessed using getGlobalStore('serviceQueues') which is registered
 * in @openmrs/esm-service-queues-app.
 */

interface ServiceQueuesStore {
  selectedQueueLocationUuid?: string;
  selectedQueueLocationName?: string;
  selectedServiceUuid?: string;
  selectedServiceDisplay?: string;
  selectedQueueStatusUuid?: string;
  selectedQueueStatusDisplay?: string;
}

/**
 * Attempts to get the service-queues store
 * 
 * @returns The store instance, or null if not available
 */
function getServiceQueuesStore() {
  try {
    return getGlobalStore<ServiceQueuesStore>('serviceQueues', {
      selectedQueueLocationUuid: undefined,
      selectedQueueLocationName: undefined,
      selectedServiceUuid: undefined,
      selectedServiceDisplay: undefined,
      selectedQueueStatusUuid: undefined,
      selectedQueueStatusDisplay: '',
    });
  } catch (error) {
    // Store not available, return null
    // This is expected when emergency-app is used standalone
    return null;
  }
}

/**
 * Hook to get the selected location UUID from service-queues store
 * 
 * This hook subscribes to the service-queues store and returns the current location UUID.
 * Returns undefined if the store is not available (e.g., when emergency-app is used standalone).
 * 
 * @returns The selected location UUID, or undefined
 */
export function useServiceQueuesLocation(): string | undefined {
  const store = getServiceQueuesStore();
  
  if (!store) {
    return undefined;
  }

  const { selectedQueueLocationUuid } = useStore(store);
  return selectedQueueLocationUuid || undefined;
}

/**
 * Hook to get location and name from service-queues store
 * 
 * This hook subscribes to the service-queues store and returns both location UUID and name.
 * Returns undefined values if the store is not available.
 * 
 * @returns Object with locationUuid and locationName, or undefined values
 */
export function useServiceQueuesLocationAndName(): {
  locationUuid?: string;
  locationName?: string;
} {
  const store = getServiceQueuesStore();
  
  if (!store) {
    return { locationUuid: undefined, locationName: undefined };
  }

  const { selectedQueueLocationUuid, selectedQueueLocationName } = useStore(store);
  return {
    locationUuid: selectedQueueLocationUuid || undefined,
    locationName: selectedQueueLocationName || undefined,
  };
}