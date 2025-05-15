import React from 'react';

import type { VirtualItem } from '@tanstack/react-virtual';

import type { FlatListProps } from './FlatList';

const COLUMN_WIDTH = 100 / 3;

type Props<TData> = {
  items: VirtualItem[];
  scrollMargin: number;
  measureElement: (node: Element | null | undefined) => void;
} & Pick<FlatListProps<TData>, 'renderItem' | 'data'>;

export const FlatListGrid = <TData,>({
  items,
  renderItem,
  scrollMargin,
  measureElement,
  data,
}: Props<TData>) => {
  return items.map(({ key, index, start, lane }) => (
    <div
      key={key}
      ref={measureElement}
      style={{
        left: `${lane * COLUMN_WIDTH}%`,
        width: `${COLUMN_WIDTH}%`,
        transform: `translateY(${start - scrollMargin}px)`,
      }}
      className='absolute top-0 animate-appear p-0.5'
      data-index={index}
    >
      {renderItem(data[index])}
    </div>
  ));
};
