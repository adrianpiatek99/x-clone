import type { ReactElement } from 'react';
import React, { cloneElement } from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { useRandomEmoji } from '@/hooks/useRandomEmoji';
import { useWindowVirtualScroll } from '@/hooks/useWindowVirtualScroll';
import type { InfiniteQueryObserverBaseResult } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props<TData> = {
  data: TData[];
  renderItem: (item: TData) => ReactElement;
  empty?: string;
  infiniteScroll?: {
    loader: ReactElement;
  } & Omit<InfiniteQueryObserverBaseResult, 'data'>;
};

const FlatList = <TData,>({ data, renderItem, empty, infiniteScroll }: Props<TData>) => {
  const t = useTranslations();
  const { items, totalSize, parentRef, measureElement } = useWindowVirtualScroll(data.length);
  const { randomEmptyStateEmoji } = useRandomEmoji();
  const isInfiniteScroll = !!infiniteScroll;
  const isEmpty = isInfiniteScroll ? !infiniteScroll.isLoading && !data.length : !data.length;

  if (isEmpty)
    return (
      <Box className='items-center gap-5 py-5'>
        <Typography className='text-[50px] leading-[1.2]'>{randomEmptyStateEmoji}</Typography>
        <Typography color='secondary'>{empty ?? t('noData')}</Typography>
      </Box>
    );

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
