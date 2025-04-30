import React from 'react';

import Skeleton from '@/components/atoms/Skeleton';
import { createArray } from '@/utils/array';

export const PostMediaGridCardSkeleton = () => {
  return (
    <div className='grid grid-cols-3 gap-1 p-0.5'>
      {createArray(9).map((number) => (
        <div key={number} className='relative pb-[100%]'>
          <Skeleton absolute withoutRadius />
        </div>
      ))}
    </div>
  );
};
