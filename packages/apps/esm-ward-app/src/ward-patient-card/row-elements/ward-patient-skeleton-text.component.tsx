import { SkeletonIcon } from '@carbon/react';
import styles from '../ward-patient-card.scss';

const WardPatientSkeletonText = () => {
  return <SkeletonIcon className={styles.skeletonText} />;
};

export default WardPatientSkeletonText;
