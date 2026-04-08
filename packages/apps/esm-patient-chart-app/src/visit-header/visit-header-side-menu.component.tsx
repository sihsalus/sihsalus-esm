import { LeftNavMenu, useLayoutType, useOnClickOutside } from '@openmrs/esm-framework';
import React, { useEffect, useRef } from 'react';

interface VisitHeaderSideMenuProps {
  isExpanded: boolean;
  toggleSideMenu: (isExpanded: boolean) => void;
}

const LEFT_NAV_EXPANDED_CLASS = 'omrs-patient-chart-left-nav-expanded';

const isDesktop = (layout: string) => layout === 'small-desktop' || layout === 'large-desktop';

const VisitHeaderSideMenu: React.FC<VisitHeaderSideMenuProps> = ({ isExpanded, toggleSideMenu }) => {
  const menuRef = useOnClickOutside(() => toggleSideMenu(false), isExpanded);
  const layout = useLayoutType();
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const popstateHandler = () => toggleSideMenu(false);
    globalThis.addEventListener('popstate', popstateHandler);
    return () => globalThis.removeEventListener('popstate', popstateHandler);
  }, [toggleSideMenu]);

  // On small-desktop, the primary navigation already renders a LeftNavMenu into
  // the container. Instead of mounting a second one (which causes duplicate slot
  // registration), toggle the container's visibility via a CSS class.
  useEffect(() => {
    if (!isDesktop(layout)) return;

    const container = document.getElementById('omrs-left-nav-container');
    containerRef.current = container;

    if (container) {
      if (isExpanded) {
        container.classList.add(LEFT_NAV_EXPANDED_CLASS);
      } else {
        container.classList.remove(LEFT_NAV_EXPANDED_CLASS);
      }
    }

    // Point the click-outside ref at the container so dismissal works
    if (menuRef && 'current' in menuRef) {
      (menuRef as React.MutableRefObject<HTMLElement | null>).current = container;
    }

    return () => {
      container?.classList.remove(LEFT_NAV_EXPANDED_CLASS);
    };
  }, [isExpanded, layout, menuRef]);

  // On tablet/mobile, no LeftNavMenu exists yet — render one directly.
  if (!isDesktop(layout)) {
    return isExpanded ? <LeftNavMenu isChildOfHeader ref={menuRef} /> : null;
  }

  // On desktop, the CSS class handles visibility — render nothing extra.
  return null;
};

export default VisitHeaderSideMenu;
