type GlobalSingletonRegistry = Record<string, unknown>;

const registryKey = '__sihsalus_esm_patient_common_lib_singletons__';

function getRegistry(): GlobalSingletonRegistry {
  const globalWithRegistry = globalThis as typeof globalThis & {
    [registryKey]?: GlobalSingletonRegistry;
  };

  if (!globalWithRegistry[registryKey]) {
    globalWithRegistry[registryKey] = {};
  }

  return globalWithRegistry[registryKey];
}

export function getOrCreateGlobalSingleton<T>(name: string, factory: () => T): T {
  const registry = getRegistry();

  if (!(name in registry)) {
    registry[name] = factory();
  }

  return registry[name] as T;
}
