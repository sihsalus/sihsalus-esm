import { Tag, Tile } from '@carbon/react';
import type { Patient } from '@openmrs/esm-framework';
import { PatientPhoto } from '@openmrs/esm-framework';
import React from 'react';
import styles from './patient-search-info.scss';

type PatientSearchInfoProps = {
  patient: Patient;
};

const PatientSearchInfo: React.FC<PatientSearchInfoProps> = ({ patient }) => {
  return (
    <Tile className={styles.patientInfo}>
      <div className={styles.patientAvatar} role="img">
        <PatientPhoto patientUuid={patient.uuid} patientName={patient.person.display} />
      </div>
      <div className={styles.patientDetails}>
        <h2 className={styles.patientName}>{patient.person.display}</h2>
        <div className={styles.demographics}>
          {patient?.person?.gender} <span className={styles.middot}>&middot;</span> {patient?.person?.age}
          <span className={styles.middot}>&middot;</span>
          <Tag>DNI:{patient.identifiers.find((id) => id.identifierType.display === 'DNI')?.identifier}</Tag>
          {/* {patient.identifiers.map((identifier) => (
            <span>{identifier.display}</span>
          ))} */}
        </div>
      </div>
    </Tile>
  );
};

export default PatientSearchInfo;
