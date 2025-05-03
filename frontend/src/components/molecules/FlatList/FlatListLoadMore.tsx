import React from 'react';

import Loader from '@/components/atoms/Loader';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

type Props = {
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export const FlatListLoadMore = ({ isFetching, hasNextPage, fetchNextPage }: Props) => {
  const { observeElement } = useIntersectionObserver({
    callback: (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    options: {
      threshold: 0,
    },
  });

  return (
    <>
      {isFetching && (
        <div className='my-[30px] pb-[40px]'>
          <Loader center />
        </div>
      )}
      {hasNextPage && (
        <div
          className='pointer-events-none absolute bottom-0 left-1/2 h-[95vh]'
          ref={observeElement}
        />
      )}
    </>
  );
};
