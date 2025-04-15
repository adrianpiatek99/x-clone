import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo, useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import type { UserPublic } from '@/db/schema';
import { useSyntheticEvents } from '@/hooks/useSyntheticEvents';
import { twMerge } from 'tailwind-merge';

import UserDisplayName from '../UserDisplayName';

type Props = ComponentPropsWithRef<'div'> & {
  user: UserPublic;
  ref?: RefCallback<HTMLDivElement>;
};

const ProfileCard = memo(({ user, className, ...props }: Props) => {
  const { profileImageUrl, description, screenName, name, isVerified } = user;
  const [isLoading] = useState(false);
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);
  const { handleOnClick, handleOnKeyUp, handleOnMouseUp } = useSyntheticEvents({
    href: profilePageHref,
  });

  return (
    <Box
      as='article'
      className={twMerge(
        'cursor-pointer px-4 py-3 outline-none transition duration-200 focus-visible:bg-text-1/10 ring-inset focus-visible:ring-focus focus-visible:ring-2',
        isLoading ? 'pointer-events-none' : 'hover:bg-text-1/5',
        className
      )}
      {...props}
      onClick={handleOnClick}
      onKeyUp={handleOnKeyUp}
      onMouseUp={handleOnMouseUp}
      tabIndex={0}
      data-navigable='true'
    >
      <Box className={twMerge('relative flex-row items-start', isLoading && 'opacity-50')}>
        <Avatar href={profilePageHref} src={profileImageUrl} screenName={screenName} />
        <Box className='gap-1'>
          <Box className='gap-0.5'>
            <UserDisplayName name={name} isVerified={isVerified} href={profilePageHref} />
            <Typography href={profilePageHref} color='secondary' truncate>
              @{screenName}
            </Typography>
          </Box>
          {description && <Typography className='whitespace-pre-line'>{description}</Typography>}
        </Box>
      </Box>
    </Box>
  );
});

export default ProfileCard;
