import { Button } from '@carbon/react';
import { Help } from '@carbon/react/icons';
import { useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import React, { useEffect, useRef, useState } from 'react';
import styles from './help.styles.scss';
import HelpMenuPopup from './help-popup.component';

export default function HelpMenu() {
  const { user } = useSession();
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuButtonRef = useRef(null);
  const popupRef = useRef(null);
  const helpMenuItems = useAssignedExtensions('help-menu-slot');

  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpMenuButtonRef.current &&
        !helpMenuButtonRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setHelpMenuOpen(false);
      }
    };

    globalThis.addEventListener(`mousedown`, handleClickOutside);
    globalThis.addEventListener(`touchstart`, handleClickOutside);
    return () => {
      globalThis.removeEventListener(`mousedown`, handleClickOutside);
      globalThis.removeEventListener(`touchstart`, handleClickOutside);
    };
  }, []);

  if (helpMenuItems.length === 0) {
    return null;
  }

  return (
    <>
      {user && (
        <Button
          className={styles.helpMenuButton}
          kind="ghost"
          onClick={toggleHelpMenu}
          ref={helpMenuButtonRef}
          size="md"
        >
          <Help size={20} />
        </Button>
      )}
      {helpMenuOpen && (
        <div id="help-menu-popup" ref={popupRef} className={styles.helpMenuPopup}>
          <HelpMenuPopup />
        </div>
      )}
    </>
  );
}
