import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import type { BaseUser } from '@/types/user';

import ArticleCard from '../ArticleCard';
import UserDisplayName from '../UserDisplayName';

type Props = ComponentPropsWithRef<'div'> & {
  user: BaseUser;
  ref?: RefCallback<HTMLDivElement>;
};

const ProfileCard = memo(({ user, ...props }: Props) => {
  const { avatarUrl, description, screenName, name, isVerified } = user;
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);

  return (
    <ArticleCard href={profilePageHref} {...props}>
      <Box className='relative flex-row items-start'>
        <Avatar href={profilePageHref} src={avatarUrl} screenName={screenName} />
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
    </ArticleCard>
  );
});

export default ProfileCard;
