import { useEffect, useState } from 'react';

import { debounce } from '@/utils/debounce';

const MOBILE_BREAKPOINT = 640;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const listener = () => {
      const media = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);

      setIsMobile(!media.matches);
    };

    listener();

    window.addEventListener('resize', debounce(listener, 150));

    return () => window.removeEventListener('resize', listener);
  }, []);

  return isMobile;
};
