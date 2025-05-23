import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import Tooltip from '@/components/atoms/Tooltip';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import { MID_DOT } from '@/constants/strings';
import { useTime } from '@/hooks/useTime';
import type { Post } from '@/types/post';

import UserDisplayName from '../UserDisplayName';

type Props = Pick<Post, 'id' | 'author' | 'createdAt'>;

export const PostCardAuthor = memo(({ author, createdAt }: Props) => {
  const { name, screenName, isVerified } = author;
  const { getLocalTime, getFullDate, getRelativeTime } = useTime();
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);

  return (
    <Box className='flex-col gap-1 min-[360px]:flex-row min-[360px]:items-center'>
      <UserDisplayName name={name} isVerified={isVerified} href={profilePageHref} />
      <div className='flex min-w-0 items-center gap-1'>
        <Typography href={profilePageHref} color='secondary' truncate>
          @{screenName}
        </Typography>
        <Typography color='secondary' className='shrink-0' truncate>
          {MID_DOT}
        </Typography>
        <Tooltip content={`${getLocalTime(createdAt)} ${MID_DOT} ${getFullDate(createdAt)}`}>
          <Typography className='whitespace-nowrap' color='secondary'>
            {getRelativeTime(createdAt)}
          </Typography>
        </Tooltip>
      </div>
    </Box>
  );
});
