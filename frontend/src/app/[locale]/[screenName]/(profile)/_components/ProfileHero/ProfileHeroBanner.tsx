import React, { memo } from 'react';

import ShimmerImage from '@/components/atoms/ShimmerImage';
import Skeleton from '@/components/atoms/Skeleton';
import type { PublicUser } from '@/types/user';

type Props = Pick<PublicUser, 'bannerUrl'> & {
  isLoading: boolean;
};

export const ProfileHeroBanner = memo(({ bannerUrl, isLoading }: Props) => {
  return (
    <div className='block overflow-hidden bg-foreground'>
      <div className='relative block w-full pb-[33.333%]'>
        {isLoading ? (
          <Skeleton absolute withoutRadius />
        ) : (
          bannerUrl && (
            <ShimmerImage className='object-cover' src={bannerUrl} alt='Profile banner' fill />
          )
        )}
      </div>
    </div>
  );
});
