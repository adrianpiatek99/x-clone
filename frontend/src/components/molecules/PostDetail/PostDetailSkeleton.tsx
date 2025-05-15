import React from 'react';

import Box from '@/components/atoms/Box';
import Skeleton from '@/components/atoms/Skeleton';

export const PostDetailSkeleton = () => {
  return (
    <Box className='px-4 py-3' as='article'>
      <Box className='relative'>
        <Box className='flex-row items-center'>
          <Skeleton width={40} height={40} variant='circular' />
          <Box className='gap-1'>
            <Skeleton width={150} height={15} />
            <Skeleton width={125} height={15} />
          </Box>
        </Box>
        <div className='my-1.5 flex flex-col gap-1.5'>
          <Skeleton height={18} />
          <Skeleton height={18} />
          <Skeleton width={200} height={18} />
        </div>
        <div className='relative pb-[56.25%]'>
          <Skeleton absolute />
        </div>
        <div>
          <Skeleton width={175} height={15} />
        </div>
        <Box className='mt-1.5 max-w-[425px] flex-row gap-6 py-1'>
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
          <Skeleton height={15} width={54} />
        </Box>
      </Box>
    </Box>
  );
};
