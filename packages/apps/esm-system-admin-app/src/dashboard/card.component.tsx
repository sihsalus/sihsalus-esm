import { ClickableTile, Layer, type TileProps } from '@carbon/react';
import { ArrowRightIcon } from '@openmrs/esm-framework';
import React from 'react';

import styles from './card.scss';

export interface LinkCardProps extends TileProps {
  header: string;
  viewLink: string;
  children?: React.ReactNode;
}

export const LinkCard: React.FC<LinkCardProps> = ({ header, viewLink, children }) => {
  return (
    <Layer>
      <a className={styles.cardLink} href={viewLink} target="_blank" rel="noreferrer">
        <ClickableTile className={styles.overviewCard}>
          <div>
            <div className={styles.heading}>{header}</div>
            <div className={styles.content}>{children}</div>
          </div>
          <div className={styles.iconWrapper}>
            <ArrowRightIcon size={16} />
          </div>
        </ClickableTile>
      </a>
    </Layer>
  );
};
