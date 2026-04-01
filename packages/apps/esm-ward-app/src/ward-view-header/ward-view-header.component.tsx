import React, { type ReactNode } from 'react';

import useWardLocation from '../hooks/useWardLocation';

import AdmissionRequestsBar from './admission-requests-bar.component';
import WardMetrics from './ward-metrics.component';
import styles from './ward-view-header.scss';

interface WardViewHeaderProps {
  wardPendingPatients: ReactNode;
}

const WardViewHeader: React.FC<WardViewHeaderProps> = ({ wardPendingPatients }) => {
  const { location } = useWardLocation();

  return (
    <div className={styles.wardViewHeader}>
      <h4>{location?.display}</h4>
      <WardMetrics />
      <AdmissionRequestsBar {...{ wardPendingPatients }} />
    </div>
  );
};

export default WardViewHeader;
