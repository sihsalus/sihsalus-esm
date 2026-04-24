import { useConfig } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import { type Config } from '../config-schema';
import { useServiceQueuesLocationAndName } from './service-queues-integration';

/**
 * Utility function to check if a location is the emergency department
 *
 * Checks by:
 * 1. UUID match with primary emergency location from config
 * 2. UUID match with UPSS emergency location from config
 * 3. Name match (case-insensitive, searches for "emergency", "emergencia", "emergencias")
 *
 * @param locationUuid - The UUID of the location to check
 * @param locationName - The name of the location to check
 * @param emergencyLocationUuid - Primary emergency location UUID from config
 * @param upssEmergencyLocationUuid - UPSS emergency location UUID from config
 * @returns true if the location is identified as emergency department
 */
export function isEmergencyLocation(
  locationUuid?: string | null,
  locationName?: string | null,
  emergencyLocationUuid?: string | null,
  upssEmergencyLocationUuid?: string | null,
): boolean {
  // If no location is selected (or "All" is selected), return false
  if (!locationUuid || locationUuid === 'all') {
    return false;
  }

  // Check by UUID from config (highest priority)
  if (emergencyLocationUuid && locationUuid === emergencyLocationUuid) {
    return true;
  }

  // Check by UPSS emergency location UUID
  if (upssEmergencyLocationUuid && locationUuid === upssEmergencyLocationUuid) {
    return true;
  }

  // Check by name (case-insensitive) - this is the primary method for flexibility
  if (locationName) {
    const nameLower = locationName.toLowerCase().trim();
    // Normalize the name by removing extra spaces and special characters for comparison
    const normalizedName = nameLower.replace(/\s+/g, ' ').replace(/[-_]/g, '');
    return (
      nameLower.includes('emergency') ||
      nameLower.includes('emergencia') ||
      nameLower.includes('emergencias') ||
      normalizedName.includes('upss emergencia') ||
      normalizedName === 'upss emergencia'
    );
  }

  return false;
}

/**
 * Hook to check if the currently selected location is the emergency department
 *
 * This hook is used by emergency-app extensions to decide whether to render or not.
 * It accesses the service-queues store if available (when integrated with service-queues-app)
 * or can be used standalone with explicit location parameters.
 *
 * @param locationUuid - Optional explicit location UUID (for standalone use)
 * @param locationName - Optional explicit location name (for standalone use)
 * @returns true if emergency location is selected
 */
export function useIsEmergencyLocation(locationUuid?: string, locationName?: string): boolean {
  const config = useConfig<Config>();
  const { locationUuid: serviceQueuesLocationUuid, locationName: serviceQueuesLocationName } =
    useServiceQueuesLocationAndName();

  return useMemo(() => {
    const actualLocationUuid = locationUuid ?? serviceQueuesLocationUuid;
    const actualLocationName = locationName ?? serviceQueuesLocationName;

    return isEmergencyLocation(
      actualLocationUuid,
      actualLocationName,
      config?.emergencyLocationUuid,
      config?.upssEmergencyLocationUuid,
    );
  }, [
    locationUuid,
    locationName,
    serviceQueuesLocationUuid,
    serviceQueuesLocationName,
    config?.emergencyLocationUuid,
    config?.upssEmergencyLocationUuid,
  ]);
}
