import type { ImportMap } from '@openmrs/esm-framework/src/internal';

export interface ImportMapOverridesApi {
  getOverrideMap(loadOverrides?: boolean): ImportMap;
  getNextPageMap(): Promise<ImportMap>;
  getCurrentPageMap(): Promise<ImportMap>;
  getDefaultMap(): Promise<ImportMap>;
  getDisabledOverrides(): string[];
  isDisabled(moduleName: string): boolean;
  enableOverride(moduleName: string): void;
  addOverride(moduleName: string, newUrl: string): void;
  removeOverride(moduleName: string): void;
  resetOverrides(): void;
}
