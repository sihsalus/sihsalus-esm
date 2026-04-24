import { HeaderGlobalAction } from '@carbon/react';
import { CloseFilledIcon, getHistory, goBackInHistory, navigate } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './close-button.scss';

const homePagePath = ['${openmrsSpaBase}', '/home'].join('');

export function CloseButton({ patientUuid }: { patientUuid: string }) {
  const { t } = useTranslation();

  const onClosePatientChart = useCallback(() => {
    const history = getHistory();
    // Get the last page the user was on before opening the patient chart by going backward
    // through the history until a URL does not include patientUuid
    let onCloseTarget = '';
    for (let i = history.length - 1; i >= 0; i--) {
      if (!history[i].includes(patientUuid)) {
        onCloseTarget = history[i];
        break;
      }
    }

    if (onCloseTarget) {
      goBackInHistory({ toUrl: onCloseTarget });
    } else {
      navigate({ to: homePagePath });
    }
  }, [patientUuid]);

  return (
    <HeaderGlobalAction
      aria-label={t('close', 'Close')}
      className={styles.headerGlobalBarCloseButton}
      onClick={onClosePatientChart}
    >
      <CloseFilledIcon size={20} />
    </HeaderGlobalAction>
  );
}
