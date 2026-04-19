import { Layer, Tile } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './error-state.scss';

export interface ErrorStateProps {
  readonly error: unknown;
  readonly headerTitle: string;
}

function getErrorResponse(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    return (error as { response?: { status?: string | number; statusText?: string } }).response;
  }

  return undefined;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, headerTitle }) => {
  const { t } = useTranslation('@sihsalus/esm-patient-chart-app');
  const isTablet = useLayoutType() === 'tablet';
  const response = getErrorResponse(error);

  return (
    <Layer>
      <Tile className={styles.tile}>
        <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{headerTitle}</h4>
        </div>
        <p className={styles.errorMessage}>
          {t('error', 'Error')} {`${response?.status}: `}
          {response?.statusText}
        </p>
        <p className={styles.errorCopy}>
          {t(
            'errorCopy',
            'Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above.',
          )}
        </p>
      </Tile>
    </Layer>
  );
};
