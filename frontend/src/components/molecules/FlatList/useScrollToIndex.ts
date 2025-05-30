import { useEffect } from 'react';

import type { ScrollToOptions } from '@tanstack/react-virtual';

type Props = {
  enabled: boolean;
  index: number;
  scrollToIndex: (index: number, options?: ScrollToOptions) => void;
};

export const useScrollToIndex = ({ enabled, index, scrollToIndex }: Props) => {
  useEffect(() => {
    if (enabled && index >= 1) {
      requestAnimationFrame(() => scrollToIndex(index, { align: 'start' }));
    }
  }, [enabled, index, scrollToIndex]);
};
