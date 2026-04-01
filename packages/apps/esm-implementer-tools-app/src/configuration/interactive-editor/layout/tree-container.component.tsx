import { StructuredListBody, StructuredListWrapper } from '@carbon/react';
import React, { type ReactNode } from 'react';

import styles from './layout.styles.scss';

export interface TreeContainerProps {
  children: ReactNode;
}

export function TreeContainer({ children }: TreeContainerProps) {
  return (
    <StructuredListWrapper className={styles.structuredList}>
      <StructuredListBody>{children}</StructuredListBody>
    </StructuredListWrapper>
  );
}
