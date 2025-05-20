import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import { useAuth } from '@/components/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import type { BaseUser, ProfileUser } from '@/types/user';

import ArticleCard from '../ArticleCard';
import { FollowButton } from '../Follow';
import UserDisplayName from '../UserDisplayName';

type Props = ComponentPropsWithRef<'div'> & {
  user: BaseUser | ProfileUser;
  ref?: RefCallback<HTMLDivElement>;
};

const ProfileCard = memo(({ user, ...props }: Props) => {
  const { user: authUser } = useAuth();
  const { avatarUrl, description, screenName, name, isVerified } = user;
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);
  const isMe = user.id === authUser?.id;
  const showFollowButton = 'isFollowing' in user && !isMe;

  return (
    <ArticleCard href={profilePageHref} {...props}>
      <Box className='relative flex-row items-start'>
        <Avatar href={profilePageHref} src={avatarUrl} screenName={screenName} />
        <Box className='grow gap-1'>
          <Box className='flex-row flex-wrap items-start justify-between'>
            <Box className='gap-0.5'>
              <UserDisplayName name={name} isVerified={isVerified} href={profilePageHref} />
              <Typography href={profilePageHref} color='secondary' truncate>
                @{screenName}
              </Typography>
            </Box>
            {showFollowButton && <FollowButton isMe={isMe} profileUserData={user} />}
          </Box>
          {description && <Typography className='whitespace-pre-line'>{description}</Typography>}
        </Box>
      </Box>
    </ArticleCard>
  );
});

export default ProfileCard;
