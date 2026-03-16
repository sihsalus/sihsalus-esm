import React, { useCallback } from 'react';
import {
  type AssignedExtension,
  ExtensionSlot,
  useConfig,
} from '@openmrs/esm-framework';
import styles from './fua-summary-tiles.scss';
import { type Config } from '../config-schema';

const FuaSummaryTiles: React.FC = () => {
  const { enableFuaApprovalWorkflow } = useConfig<Config>();

  const select = useCallback(
    (extensions: Array<AssignedExtension>) =>
      extensions.filter((ext) => {
        const hasMeta = Object.keys(ext.meta).length > 0;
        const isAllowed =
          ext.name !== 'pending-review-list-tile-component' || enableFuaApprovalWorkflow === true;
        return hasMeta && isAllowed;
      }),
    [enableFuaApprovalWorkflow],
  );

  return (
    <ExtensionSlot
      name="fua-tiles-slot"
      select={select}
      className={styles.cardContainer}
    />
  );
};

export default FuaSummaryTiles;
