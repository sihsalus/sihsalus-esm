import { IconButton } from '@carbon/react';
import { ArrowLeftIcon, CloseIcon, getCoreTranslation, useLayoutType } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React from 'react';

import { closeOverlay, useOverlay } from '../hooks/useOverlay';

import styles from './overlay.scss';

const Overlay: React.FC = () => {
  const { header, component, isOverlayOpen } = useOverlay();
  const layout = useLayoutType();

  return (
    <>
      {isOverlayOpen && (
        <div
          className={classNames({
            [styles.desktopOverlay]: layout !== 'tablet',
            [styles.tabletOverlay]: layout === 'tablet',
          })}
        >
          {layout === 'tablet' && (
            <header aria-label="Tablet overlay" className={styles.tabletOverlayHeader} onClick={closeOverlay}>
              <IconButton label="">
                <ArrowLeftIcon size={16} />
              </IconButton>
              <div className={styles.headerContent}>{header}</div>
            </header>
          )}

          {layout !== 'tablet' && (
            <div className={styles.desktopHeader}>
              <div className={styles.headerContent}>{header}</div>
              <IconButton
                className={styles.closePanelButton}
                kind="ghost"
                label={getCoreTranslation('close')}
                onClick={closeOverlay}
              >
                <CloseIcon size={16} />
              </IconButton>
            </div>
          )}
          {component}
        </div>
      )}
    </>
  );
};

export default Overlay;
