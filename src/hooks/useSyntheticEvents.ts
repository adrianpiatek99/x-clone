import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useRef } from 'react';

import { useRouter } from '@/i18n/routing';

type Props = {
  href: string;
  onNavigate?: () => void;
  elementType?: string;
};

/**
 * Hook that handles synthetic events for any component.
 * Manages click, keyboard, and mouse interactions for navigation.
 * Elements with data-navigable="true" attribute will trigger navigation.
 *
 * @param href - URL to navigate to
 * @param onNavigate - Optional callback to execute before navigation
 */
export const useSyntheticEvents = ({ href, elementType = 'article', onNavigate }: Props) => {
  const { push } = useRouter();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>(null);

  const shouldNavigate = useCallback(
    (target: HTMLElement) => {
      const hasClickHandler = target.onclick !== null;
      const hasLink = target.closest('a') !== null;
      const hasButton = target.closest('button') !== null;
      const isNavigable = target.closest('[data-navigable="true"]') !== null;
      const isElementType = target.tagName.toLowerCase() === elementType;
      const selection = window.getSelection();
      const hasSelectedText = selection ? selection.toString().length > 0 : false;

      return (
        !hasSelectedText &&
        ((isElementType && isNavigable) ||
          (isNavigable && !hasClickHandler && !hasLink && !hasButton))
      );
    },
    [elementType]
  );

  const navigate = useCallback(() => {
    if (onNavigate) {
      onNavigate();
    }

    push(href);

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  }, [push, href, onNavigate]);

  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;

      if (shouldNavigate(target)) {
        navigate();
      }
    },
    [navigate, shouldNavigate]
  );

  const handleOnKeyUp = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;

      if (e.code === 'Enter' && shouldNavigate(target)) {
        navigate();
      }
    },
    [navigate, shouldNavigate]
  );

  const handleOnMouseUp = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;

      if (e.button === 1 && shouldNavigate(target)) {
        window.open(href, '_blank');
      }
    },
    [href, shouldNavigate]
  );

  return { handleOnClick, handleOnKeyUp, handleOnMouseUp };
};
