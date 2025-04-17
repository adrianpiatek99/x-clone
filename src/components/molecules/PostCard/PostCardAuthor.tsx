import type { ReactNode } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import Tooltip from '@/components/atoms/Tooltip';
import Typography from '@/components/atoms/Typography';
import { ROUTES } from '@/constants/routes';
import { MID_DOT } from '@/constants/strings';
import type { Post } from '@/db/schema';
import { useTime } from '@/hooks/useTime';

import UserDisplayName from '../UserDisplayName';

type Props = Pick<Post, 'id' | 'author' | 'createdAt'> & {
  children: ReactNode;
};

export const PostCardAuthor = ({ id, author, createdAt, children }: Props) => {
  const { name, screenName, isVerified } = author;
  const { getLocalTime, getFullDate, getRelativeTime } = useTime();
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);
  const postPageHref = ROUTES.POST.DETAILS(screenName, id);

  return (
    <Box className='flex-row items-center justify-between gap-2'>
      <Box className='flex-col gap-1 min-[360px]:flex-row min-[360px]:items-center'>
        <UserDisplayName name={name} isVerified={isVerified} href={profilePageHref} />
        <div className='flex min-w-0 items-center gap-1'>
          <Typography href={profilePageHref} color='secondary' truncate>
            @{screenName}
          </Typography>
          <Typography color='secondary' truncate>
            {MID_DOT}
          </Typography>
          <Tooltip content={`${getLocalTime(createdAt)} ${MID_DOT} ${getFullDate(createdAt)}`}>
            <Typography className='whitespace-nowrap' href={postPageHref} color='secondary'>
              {getRelativeTime(createdAt)}
            </Typography>
          </Tooltip>
        </div>
      </Box>
      {children}
    </Box>
  );
};
