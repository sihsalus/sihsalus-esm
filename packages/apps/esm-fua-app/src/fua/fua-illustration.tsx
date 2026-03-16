import React from 'react';
import { ChartRelationship } from '@carbon/react/icons';
import styles from './fua-header.scss';

const FuaIllustration: React.FC = () => {
  return (
    <div className={styles.svgContainer}>
      <ChartRelationship className={styles.iconOverrides} />
    </div>
  );
};

export default FuaIllustration;
