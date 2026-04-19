import { Button, Tag, Toggletip, ToggletipButton, ToggletipContent } from '@carbon/react';
import { CloseIcon, EditIcon } from '@openmrs/esm-framework';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './flags.scss';
import { type PatientFlag, usePatientFlags } from './hooks/usePatientFlags';

interface FlagsProps {
  patientUuid: string;
  onHandleCloseHighlightBar: () => void;
  showHighlightBar: boolean;
}

const Flags: React.FC<FlagsProps> = ({ patientUuid, onHandleCloseHighlightBar, showHighlightBar }) => {
  const { t } = useTranslation();
  const { flags, isLoading, error } = usePatientFlags(patientUuid);
  const filteredFlags = flags.filter((f: PatientFlag) => !f.voided);

  const handleClickEditFlags = useCallback(() => launchPatientWorkspace('edit-flags-side-panel-form'), []);

  const InfoFlags = () => {
    const hasInfoFlag = (tags: PatientFlag['tags']) => tags?.filter((t) => t.display.includes('info')).length;
    const infoFlags = filteredFlags.filter((f: PatientFlag) => hasInfoFlag(f.tags));

    return (
      <>
        {infoFlags?.map((infoFlag) => (
          <Toggletip key={infoFlag.uuid} align="bottom-start">
            <ToggletipButton label="Info flag">
              <Tag key={infoFlag.uuid} className={styles.infoFlagTag}>
                {infoFlag.flag.display}
              </Tag>
            </ToggletipButton>
            <ToggletipContent>
              <div className={styles.content}>
                <p className={styles.title}>{infoFlag.flag.display}</p>
                <p className={styles.message}>{infoFlag.message}</p>
              </div>
            </ToggletipContent>
          </Toggletip>
        ))}
      </>
    );
  };

  const RiskFlags = () => {
    const hasRiskFlag = (tags: PatientFlag['tags']) => tags?.filter((t) => t.display.includes('risk')).length;
    const riskFlags = filteredFlags.filter((f: PatientFlag) => hasRiskFlag(f.tags));

    return (
      <>
        {riskFlags.map((riskFlag) => (
          <Toggletip key={riskFlag.uuid} align="bottom-start">
            <ToggletipButton label="Risk flag">
              <Tag key={riskFlag.uuid} type="high-contrast" className={styles.flagTag}>
                <span className={styles.flagIcon}>&#128681;</span> {riskFlag.flag.display}
              </Tag>
            </ToggletipButton>
            <ToggletipContent>
              <div className={styles.content}>
                <p className={styles.title}>{riskFlag.flag.display}</p>
                <p className={styles.message}>{riskFlag.message}</p>
              </div>
            </ToggletipContent>
          </Toggletip>
        ))}
      </>
    );
  };

  if (!isLoading && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.flagsContainer}>
          <RiskFlags />
          <InfoFlags />
        </div>
        {filteredFlags.length > 0 ? (
          <Button
            className={styles.actionButton}
            kind="ghost"
            renderIcon={EditIcon}
            onClick={handleClickEditFlags}
            iconDescription={t('editFlags', 'Edit flags')}
          >
            {t('edit', 'Edit')}
          </Button>
        ) : null}
        {showHighlightBar ? (
          <Button
            className={styles.actionButton}
            hasIconOnly
            iconDescription={t('closeFlagsBar', 'Close flags bar')}
            kind="ghost"
            renderIcon={CloseIcon}
            onClick={onHandleCloseHighlightBar}
          />
        ) : null}
      </div>
    );
  }

  return null;
};

export default Flags;
