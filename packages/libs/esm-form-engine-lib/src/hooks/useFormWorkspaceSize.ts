import { useLayoutEffect, useMemo, useState } from 'react';
import { pxToRem } from '../utils/common-utils';

/**
 * The width of the supported workspace variants in rem
 */
const narrowWorkspaceWidth = 26.25;
const widerWorkspaceWidth = 32.25;
const extraWideWorkspaceWidth = 48.25;

type WorkspaceSize = 'narrow' | 'wider' | 'extra-wide' | 'ultra-wide';

/**
 * This hook evaluates the size of the current workspace based on the width of the container element
 */
export function useFormWorkspaceSize(rootRef: React.RefObject<HTMLElement | null>): WorkspaceSize {
  // width in rem
  const [containerWidth, setContainerWidth] = useState(0);
  const size = useMemo(() => {
    if (containerWidth <= narrowWorkspaceWidth) {
      return 'narrow';
    } else if (containerWidth <= widerWorkspaceWidth) {
      return 'wider';
    } else if (containerWidth <= extraWideWorkspaceWidth) {
      return 'extra-wide';
    } else {
      return 'ultra-wide';
    }
  }, [containerWidth]);

  useLayoutEffect(() => {
    const handleResize = (): void => {
      const nextContainerWidth = rootRef.current?.parentElement?.offsetWidth;
      const rootFontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
      if (nextContainerWidth) {
        setContainerWidth(pxToRem(nextContainerWidth, rootFontSize));
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver((_entries): void => {
      handleResize();
    });

    if (rootRef.current?.parentElement) {
      resizeObserver.observe(rootRef.current?.parentElement);
    }

    return (): void => {
      resizeObserver.disconnect();
    };
  }, [rootRef]);

  return size;
}
