import { createGlobalStore, createUseStore } from '@openmrs/esm-framework';
import type { StoreApi } from 'zustand';
import { getOrCreateGlobalSingleton } from '../store/global-singleton';

type NavGroupStore = {
  navGroups: Array<string>;
};

const navGroupStore = getOrCreateGlobalSingleton<StoreApi<NavGroupStore>>('nav-groups', () =>
  createGlobalStore<NavGroupStore>('nav-groups', { navGroups: [] }),
);

export function registerNavGroup(slotName: string): void {
  const store = navGroupStore.getState();
  navGroupStore.setState({ navGroups: [slotName, ...store.navGroups] });
}

export const useNavGroups = createUseStore(navGroupStore);
