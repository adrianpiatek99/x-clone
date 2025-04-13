import type { FC } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import Skeleton from '@/components/atoms/Skeleton';
import { createArray } from '@/utils/array';

interface PostCellSkeletonProps {
  isEven?: boolean;
}

export const PostCardSkeleton: FC<PostCellSkeletonProps> = ({ isEven = false }) => {
  return (
    <Box className='flex-row border-b border-border-1 px-4 py-3'>
      <Skeleton width={40} height={40} variant='circular' />
      <Box className='mt-0.5 grow gap-3'>
        <Skeleton width={200} height={15} />
        <Box className='gap-1'>
          <Skeleton height={15} />
          {!isEven && <Skeleton height={15} />}
          <Skeleton width={175} height={15} />
        </Box>
        {!isEven && (
          <div className='relative pb-[56.25%]'>
            <Skeleton absolute />
          </div>
        )}
        <Box className='mt-1.5 max-w-[425px] flex-row gap-6 px-2.5 py-1'>
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
        </Box>
      </Box>
    </Box>
  );
};

export const PostCardSkeletons = () => {
  return (
    <>
      {createArray(3).map((skeleton) => (
        <PostCardSkeleton key={skeleton} isEven={skeleton % 2 === 0} />
      ))}
    </>
  );
};
