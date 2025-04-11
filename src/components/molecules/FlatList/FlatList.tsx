import type { ReactElement } from 'react';
import React, { cloneElement } from 'react';

import { useWindowVirtualScroll } from '@/hooks/useWindowVirtualScroll';
import type { InfiniteQueryObserverBaseResult } from '@tanstack/react-query';

type EmptyMessage = {
  title?: string;
  description: string;
};

type Props<TData> = {
  data: TData[];
  renderItem: (item: TData) => ReactElement;
  infiniteScroll?: {
    loader: ReactElement;
    emptyMessage: EmptyMessage;
  } & Omit<InfiniteQueryObserverBaseResult, 'data'>;
};

const FlatList = <TData,>({ data, renderItem, infiniteScroll }: Props<TData>) => {
  const { items, totalSize, parentRef, measureElement } = useWindowVirtualScroll(data.length);
  const isInfiniteScroll = !!infiniteScroll;

  return (
    <section className='flex w-full flex-col' ref={parentRef}>
      {isInfiniteScroll && infiniteScroll.isLoading ? (
        cloneElement(infiniteScroll.loader)
      ) : (
        <div style={{ height: `${totalSize}px` }} className='relative w-full'>
          {items.map(({ key, index, start }) => (
            <div
              key={key}
              ref={measureElement}
              style={{
                transform: `translateY(${start}px)`,
              }}
              className='absolute left-0 top-0 w-full animate-appear'
              data-index={index}
            >
              {renderItem(data[index])}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FlatList;
