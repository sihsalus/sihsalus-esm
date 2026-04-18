import { age, getPatientName, formatDate, parseDate } from '@openmrs/esm-framework';
import capitalize from 'lodash-es/capitalize';
import React from 'react';

import styles from './patient-details-tile.scss';

interface PatientDetailsTileInterface {
  patient: fhir.Patient;
}

const PatientDetailsTile: React.FC<PatientDetailsTileInterface> = ({ patient }) => {
  return (
    <div className={styles.container}>
      <p className={styles.name}>{patient ? getPatientName(patient) : ''}</p>
      <div className={styles.details}>
        <span>{capitalize(patient?.gender)}</span> &middot; <span>{age(patient?.birthDate)}</span> &middot;{' '}
        <span>{formatDate(parseDate(patient?.birthDate), { mode: 'wide', time: false })}</span>
      </div>
    </div>
  );
};

export default PatientDetailsTile;
