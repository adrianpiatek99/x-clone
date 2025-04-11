import { useRef } from 'react';

import { observeWindowOffset, useWindowVirtualizer } from '@tanstack/react-virtual';

export const useWindowVirtualScroll = (count: number) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { getVirtualItems, getTotalSize, measureElement } = useWindowVirtualizer({
    count,
    estimateSize: () => 40,
    overscan: 2,
    observeElementOffset: (instance, cb) =>
      observeWindowOffset(instance, (offset, isScrolling) =>
        cb(offset - (parentRef.current?.offsetTop || 0), isScrolling)
      ),
  });
  const items = getVirtualItems();
  const totalSize = getTotalSize();

  return {
    items,
    totalSize,
    measureElement,
    parentRef,
  };
};
