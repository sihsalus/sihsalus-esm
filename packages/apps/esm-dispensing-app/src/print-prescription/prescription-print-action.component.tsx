import { Button } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type PrescriptionPrintActionProps = {
  encounterUuid: string;
  patientUuid: string;
};

const PrescriptionPrintAction: React.FC<PrescriptionPrintActionProps> = ({ encounterUuid, patientUuid }) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    const dispose = showModal('prescription-print-preview-modal', {
      onClose: () => dispose(),
      encounterUuid,
      patientUuid,
    });
  }, [encounterUuid, patientUuid]);

  return (
    <Button renderIcon={Printer} iconDescription={t('print', 'Print')} onClick={handleClick} kind="ghost">
      {t('printPrescriptions', 'Print prescriptions')}
    </Button>
  );
};

export default PrescriptionPrintAction;
