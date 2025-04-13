import type { ReactElement } from 'react';
import React, { cloneElement } from 'react';

import Empty from '@/components/atoms/Empty';
import ErrorState from '@/components/atoms/ErrorState';
import Loader from '@/components/atoms/Loader';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useWindowVirtualScroll } from '@/hooks/useWindowVirtualScroll';
import type { InfiniteQueryObserverBaseResult } from '@tanstack/react-query';

type Props<TData> = {
  data: TData[];
  renderItem: (item: TData) => ReactElement;
  empty?: string;
  infiniteScroll?: {
    loader: ReactElement;
  } & Omit<InfiniteQueryObserverBaseResult, 'data'>;
};

const FlatList = <TData,>({ data, renderItem, empty, infiniteScroll }: Props<TData>) => {
  const { items, totalSize, parentRef, measureElement } = useWindowVirtualScroll(data.length);
  const isInfiniteScroll = !!infiniteScroll;
  const isEmpty = isInfiniteScroll ? !infiniteScroll.isLoading && !data.length : !data.length;
  const isError = !!infiniteScroll?.isError;

  const { observeElement } = useIntersectionObserver({
    callback: (entry) => {
      if (!isInfiniteScroll) return;

      const { isFetching, hasNextPage, fetchNextPage } = infiniteScroll!;

      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    options: {
      threshold: 0,
    },
  });

  if (isError) return <ErrorState onRetry={() => infiniteScroll.refetch()} />;

  if (isEmpty) return <Empty message={empty} />;

  return (
    <section className='relative flex w-full flex-col' ref={parentRef}>
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
      {isInfiniteScroll && (
        <>
          {infiniteScroll.isFetching && !infiniteScroll.isLoading && (
            <div className='my-[30px] pb-[40px]'>
              <Loader center />
            </div>
          )}
          {infiniteScroll.hasNextPage && !infiniteScroll.isLoading && (
            <div
              className='pointer-events-none absolute bottom-0 left-1/2 h-[95vh]'
              ref={observeElement}
            />
          )}
        </>
      )}
    </section>
  );
};

export default FlatList;
