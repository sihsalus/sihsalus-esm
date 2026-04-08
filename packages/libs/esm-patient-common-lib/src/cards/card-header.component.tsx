import { useLayoutType } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React from 'react';

import styles from './card-header.scss';

interface CardHeaderProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

export function CardHeader({ title, children }: CardHeaderProps) {
  const isTablet = useLayoutType() === 'tablet';

  return (
    <div className={classNames(isTablet ? styles.tabletHeader : styles.desktopHeader)}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}
