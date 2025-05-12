import React from 'react';

import Avatar from '@/components/atoms/Avatar';
import type { ProfileUser } from '@/types/user';

type Props = Pick<ProfileUser, 'avatarUrl'> & {
  isLoading: boolean;
};

export const ProfileHeroAvatar = ({ avatarUrl, isLoading }: Props) => {
  return (
    <div className='relative mt-[-15%] flex w-1/4 min-w-[48px]'>
      <div className='size-full rounded-full pb-[100%]'>
        <Avatar
          className='border-background absolute inset-0 size-full border-[3px]'
          src={avatarUrl}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
