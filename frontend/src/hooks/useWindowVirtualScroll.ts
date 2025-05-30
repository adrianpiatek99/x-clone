import { useRef } from 'react';

import type { VirtualScrollKeys } from '@/stores/virtualScroll';
import { useVirtualScrollStore } from '@/stores/virtualScroll';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useShallow } from 'zustand/shallow';

export const useWindowVirtualScroll = (
  count: number,
  scrollKey?: VirtualScrollKeys,
  lanes?: number
) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { getState, update } = useVirtualScrollStore(
    useShallow((state) => ({
      getState: state.getState,
      update: state.update,
    }))
  );
  const offset = scrollKey ? (getState(scrollKey)?.offset ?? 0) : 0;
  const cache = scrollKey ? (getState(scrollKey)?.cache ?? []) : [];

  const { getVirtualItems, getTotalSize, measureElement, options, scrollToIndex } =
    useWindowVirtualizer({
      count,
      estimateSize: () => 200,
      overscan: 5,
      scrollMargin: parentRef.current?.offsetTop ?? 0,
      initialOffset: offset,
      initialMeasurementsCache: cache,
      onChange: (virtualizer) => {
        if (!virtualizer.isScrolling && scrollKey) {
          update(scrollKey, {
            offset: virtualizer.scrollOffset ?? 0,
            cache: virtualizer.measurementsCache,
          });
        }
      },
      lanes,
    });
  const items = getVirtualItems();
  const totalSize = getTotalSize();

  return {
    items,
    totalSize,
    measureElement,
    parentRef,
    options,
    scrollToIndex,
  };
};
