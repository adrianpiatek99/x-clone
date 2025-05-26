'use client';

import type { ReactElement, ReactNode } from 'react';
import React, { cloneElement } from 'react';

import Empty from '@/components/atoms/Empty';
import ErrorState from '@/components/atoms/ErrorState';
import { useWindowVirtualScroll } from '@/hooks/useWindowVirtualScroll';
import type { VirtualScrollKeys } from '@/stores/virtualScroll';
import type { InfiniteQueryObserverBaseResult } from '@tanstack/react-query';

import { FlatListGrid } from './FlatListGrid';
import { FlatListLoadMore } from './FlatListLoadMore';
import { FlatListPillNotify } from './FlatListPillNotify';

export type FlatListProps<TData> = {
  data: TData[];
  renderItem: (item: TData) => ReactElement;
  empty: {
    title: string;
    description?: string;
  };
  infiniteScroll?: {
    loader: ReactElement;
  } & Omit<InfiniteQueryObserverBaseResult, 'data'>;
  scrollKey?: VirtualScrollKeys;
  additionalPillNotify?: ReactNode;
  isGrid?: boolean;
};

/**
 * A virtualized list component that efficiently renders large lists of data.
 * Supports infinite scrolling, loading states, and empty states.
 * Uses window-based virtualization for optimal performance with large datasets.
 */
const FlatList = <TData,>({
  data,
  renderItem,
  empty,
  infiniteScroll,
  scrollKey,
  additionalPillNotify,
  isGrid,
}: FlatListProps<TData>) => {
  const { items, totalSize, parentRef, measureElement, options } = useWindowVirtualScroll(
    data.length,
    scrollKey,
    isGrid ? 3 : undefined
  );
  const isInfiniteScroll = !!infiniteScroll;
  const isEmpty = isInfiniteScroll ? !infiniteScroll.isLoading && !data.length : !data.length;
  const isError = !!infiniteScroll?.isError;

  if (isError) return <ErrorState onRetry={() => infiniteScroll.refetch()} />;

  return (
    <section className='relative flex w-full flex-col' ref={parentRef}>
      {isEmpty ? (
        <Empty title={empty.title} description={empty?.description} />
      ) : (
        <>
          <FlatListPillNotify
            isRefetching={!!infiniteScroll?.isRefetching}
            additionalPillNotify={additionalPillNotify}
          />
          {isInfiniteScroll && infiniteScroll.isLoading ? (
            cloneElement(infiniteScroll.loader)
          ) : (
            <div style={{ height: `${totalSize}px` }} className='relative w-full'>
              {isGrid ? (
                <FlatListGrid
                  items={items}
                  scrollMargin={options.scrollMargin}
                  measureElement={measureElement}
                  data={data}
                  renderItem={renderItem}
                />
              ) : (
                items.map(({ key, index, start }) => (
                  <div
                    key={key}
                    ref={measureElement}
                    style={{
                      transform: `translateY(${start - options.scrollMargin}px)`,
                    }}
                    className='animate-appear absolute left-0 top-0 w-full'
                    data-index={index}
                  >
                    {renderItem(data[index])}
                  </div>
                ))
              )}
            </div>
          )}
          {isInfiniteScroll && !infiniteScroll.isLoading && (
            <FlatListLoadMore
              isFetching={infiniteScroll.isFetching}
              hasNextPage={infiniteScroll.hasNextPage}
              fetchNextPage={infiniteScroll.fetchNextPage}
            />
          )}
        </>
      )}
    </section>
  );
};

export default FlatList;
