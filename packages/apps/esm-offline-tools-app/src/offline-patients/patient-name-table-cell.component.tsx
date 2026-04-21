import { Link, Tag } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './patient-name-table-cell.scss';

export interface PatientNameTableCellProps {
  patient: fhir.Patient;
  isNewlyRegistered?: boolean;
}

const PatientNameTableCell: React.FC<PatientNameTableCellProps> = ({ patient, isNewlyRegistered = false }) => {
  const { t } = useTranslation();
  const nameObj = patient.name?.[0];
  const name = nameObj?.text ?? [nameObj?.family, ...(nameObj?.given ?? [])].filter(Boolean).join(' ');

  return (
    <div className={styles.cellContainer}>
      <Link
        onClick={() =>
          navigate({
            to: `${globalThis.getOpenmrsSpaBase()}patient/${patient.id}/chart`,
          })
        }
      >
        {name}
      </Link>
      {isNewlyRegistered && <Tag type="magenta">{t('offlinePatientsTableNameNewlyRegistered', 'New')}</Tag>}
    </div>
  );
};

export default PatientNameTableCell;
