import React, { useRef, useEffect } from 'react';

import ImportMapList from './import-map-list/list.component';
import styles from './import-map.styles.css';

type ImportMapProps = {
  toggleOverridden(overridden: boolean): void;
};

const IMPORT_MAP_CHANGE_EVENT = 'import-map-overrides:change';

export default function ImportMap({ toggleOverridden }: ImportMapProps) {
  const importMapListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleImportMapChange = () => {
      toggleOverridden(importMapOverridden());
    };

    globalThis.addEventListener(IMPORT_MAP_CHANGE_EVENT, handleImportMapChange);
    return () => globalThis.removeEventListener(IMPORT_MAP_CHANGE_EVENT, handleImportMapChange);
  }, [toggleOverridden]);

  return <div className={styles.importMap}>{<ImportMapList ref={importMapListRef} />}</div>;
}

export function importMapOverridden(): boolean {
  return Object.keys(globalThis.importMapOverrides.getOverrideMap().imports).length > 0;
}

export function isOverriddenInImportMap(esmName: string): boolean {
  return Object.prototype.hasOwnProperty.call(globalThis.importMapOverrides.getOverrideMap().imports, esmName);
}
