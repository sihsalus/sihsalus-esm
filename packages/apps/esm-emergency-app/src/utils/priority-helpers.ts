/**
 * Pure utility functions for emergency priority lookup, sorting, and display.
 *
 * These are NOT React hooks — they receive priorityConfigs as a parameter.
 * For use inside React components, prefer usePriorityConfig() which wraps
 * these functions with the current config already injected.
 *
 * Priority system: 4 tiers (I–IV) based on Peru's NTS 042-MINSA.
 * Lower sortWeight = higher clinical priority (I=0, II=1, III=2, IV=3).
 */

import { type PriorityConfig } from '../config-schema';

/**
 * Get priority configuration by UUID
 * Useful for displaying priority information based on queue entry data
 */
export function getPriorityConfigByUuid(uuid: string, priorityConfigs: PriorityConfig[]) {
  return priorityConfigs.find((p) => p.conceptUuid === uuid);
}

/**
 * Get priority configuration by code
 */
export function getPriorityConfigByCode(code: string, priorityConfigs: PriorityConfig[]) {
  return priorityConfigs.find((p) => p.code === code);
}

/**
 * Get priority configuration by label (for backward compatibility with existing data)
 */
export function getPriorityConfigByLabel(label: string, priorityConfigs: PriorityConfig[]) {
  return priorityConfigs.find((p) => p.label === label);
}

/**
 * Get priority color for display (for Carbon tags, badges, etc.)
 */
export function getPriorityColor(uuid: string, priorityConfigs: PriorityConfig[]): string {
  const priority = getPriorityConfigByUuid(uuid, priorityConfigs);
  return priority?.color || 'gray';
}

/**
 * Get priority label for display
 */
export function getPriorityLabel(uuid: string, priorityConfigs: PriorityConfig[]): string {
  const priority = getPriorityConfigByUuid(uuid, priorityConfigs);
  return priority?.label || 'Desconocida';
}

/**
 * Get priority sort weight (for sorting queue entries)
 */
export function getPrioritySortWeight(uuid: string, priorityConfigs: PriorityConfig[]): number {
  const priority = getPriorityConfigByUuid(uuid, priorityConfigs);
  return priority?.sortWeight ?? 999;
}

/**
 * Sort queue entries by priority (highest priority first)
 */
export function sortByPriority<T extends { priority: { uuid: string } }>(
  entries: T[],
  priorityConfigs: PriorityConfig[]
): T[] {
  return [...entries].sort((a, b) => {
    const weightA = getPrioritySortWeight(a.priority.uuid, priorityConfigs);
    const weightB = getPrioritySortWeight(b.priority.uuid, priorityConfigs);
    return weightA - weightB;
  });
}

/**
 * Get all priorities as an array (useful for dropdowns, selects, etc.)
 */
export function getAllPriorities(priorityConfigs: PriorityConfig[]) {
  return priorityConfigs.map((p) => ({
    uuid: p.conceptUuid,
    code: p.code,
    label: p.label,
    description: p.description,
    color: p.color,
    sortWeight: p.sortWeight,
    maxWaitTimeMinutes: p.maxWaitTimeMinutes,
  }));
}

/**
 * Check if a wait time exceeds the maximum for a given priority
 */
export function isWaitTimeExceeded(
  priorityUuid: string,
  waitTimeMinutes: number,
  priorityConfigs: PriorityConfig[]
): boolean {
  const priority = getPriorityConfigByUuid(priorityUuid, priorityConfigs);
  if (!priority) return false;
  
  // Priority I should be attended immediately (0 minutes)
  if (priority.code === 'PRIORITY_I' && waitTimeMinutes > 0) return true;
  
  return waitTimeMinutes > priority.maxWaitTimeMinutes;
}

/**
 * Get CSS class for priority styling
 */
export function getPriorityCssClass(uuid: string, priorityConfigs: PriorityConfig[]): string {
  const priority = getPriorityConfigByUuid(uuid, priorityConfigs);
  if (!priority) return 'priority-unknown';
  
  return `priority-${priority.code.toLowerCase().replace('_', '-')}`;
}

