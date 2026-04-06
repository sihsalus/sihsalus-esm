import { useEffect } from 'react';

import type { FormEntryReactConfig } from '../types';

/**
 * Converts a module name (e.g., "@myOrg/myGreatDataSource") to a window global slug.
 * Matches the Angular app's logic for finding modules via webpack module federation.
 */
function slugify(name: string): string {
  return name.replace(/[/@-]/g, '_');
}

/**
 * Loads custom data sources from window globals (webpack module federation)
 * and registers them with the FormEngine's data source registry.
 *
 * Each custom data source is defined in the config as:
 * { name, moduleName, moduleExport }
 *
 * The module is expected to be loaded via the import map and accessible
 * as window[slugify(moduleName)].
 */
export function useCustomDataSources(config: FormEntryReactConfig) {
  useEffect(() => {
    if (!config.customDataSources?.length) return;

    const loadDataSources = async () => {
      for (const { name, moduleName, moduleExport } of config.customDataSources) {
        try {
          const slug = slugify(moduleName);
          const moduleEntry = (window as any)[slug];

          if (!moduleEntry?.get) {
            console.warn(
              `Custom data source "${name}": module "${moduleName}" (window.${slug}) not found or does not have a "get" method.`,
            );
            continue;
          }

          const factory = await moduleEntry.get('./start');
          const module = factory();
          const dataSource = module[moduleExport] ?? module.default;

          if (!dataSource) {
            console.warn(
              `Custom data source "${name}": export "${moduleExport}" not found in module "${moduleName}".`,
            );
            continue;
          }

          // Register with FormEngine's data source registry if available
          try {
            const { registerCustomDataSource } = await import('@openmrs/esm-form-engine-lib');
            if (typeof registerCustomDataSource === 'function') {
              registerCustomDataSource({
                name,
                load: () => Promise.resolve({ default: dataSource }),
              });
            }
          } catch {
            console.warn(`Could not register custom data source "${name}" with FormEngine registry.`);
          }
        } catch (error) {
          console.warn(`Failed to load custom data source "${name}" from module "${moduleName}":`, error);
        }
      }
    };

    loadDataSources();
  }, [config.customDataSources]);
}
