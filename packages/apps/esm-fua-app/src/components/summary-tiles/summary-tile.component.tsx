import React from 'react';
import { Tile } from '@carbon/react';
import styles from './summary-tiles.scss';

interface FuaSummaryTileProps {
  label: string;
  value: number;
  headerLabel: string;
  children?: React.ReactNode;
}

const FuaSummaryTile: React.FC<FuaSummaryTileProps> = ({ label, value, headerLabel, children }) => {
  return (
    <Tile className={styles.tileContainer}>
      <div className={styles.tileHeader}>
        <div className={styles.headerLabelContainer}>
          <label className={styles.headerLabel}>{headerLabel}</label>
          {children}
        </div>
      </div>
      <div>
        <label className={styles.totalsLabel}>{label}</label>
        <p className={styles.totalsValue}>{value}</p>
      </div>
    </Tile>
  );
};

export default FuaSummaryTile;
