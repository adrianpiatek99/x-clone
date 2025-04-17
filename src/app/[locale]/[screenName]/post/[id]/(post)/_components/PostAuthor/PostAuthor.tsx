import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import UserDisplayName from '@/components/molecules/UserDisplayName';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';

type Props = PropsWithChildren & Pick<Post, 'author'>;

const PostAuthor = ({ children, author }: Props) => {
  const { name, screenName, isVerified } = author;
  const profilePageHref = ROUTES.PROFILE.DETAILS(screenName);

  return (
    <Box className='grow flex-row items-center justify-between gap-2'>
      <Box className='flex-col gap-0.5'>
        <UserDisplayName name={name} isVerified={isVerified} href={profilePageHref} />
        <div className='flex min-w-0 items-center gap-1'>
          <Typography href={profilePageHref} color='secondary' truncate>
            @{screenName}
          </Typography>
        </div>
      </Box>
      {children}
    </Box>
  );
};

export default PostAuthor;
