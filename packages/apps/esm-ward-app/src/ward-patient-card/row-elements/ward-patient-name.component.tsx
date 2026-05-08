import { type Patient } from '@openmrs/esm-framework';
import React from 'react';
import styles from '../ward-patient-card.scss';

export interface WardPatientNameProps {
  patient: Patient;
}

const WardPatientName: React.FC<WardPatientNameProps> = ({ patient }) => {
  return <div className={styles.wardPatientName}>{patient?.person?.preferredName?.display}</div>;
};

export default WardPatientName;
