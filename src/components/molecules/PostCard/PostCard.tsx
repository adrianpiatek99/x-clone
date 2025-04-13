import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/db/schema';
import { twMerge } from 'tailwind-merge';

import { PostCardActions } from './PostCardActions';
import { PostCardAuthor } from './PostCardAuthor';
import { PostCardDropdown } from './PostCardDropdown';
import { PostCardMedia } from './PostCardMedia';
import { PostCardText } from './PostCardText';

type Props = ComponentPropsWithRef<'div'> & {
  data: Post;
  ref?: RefCallback<HTMLDivElement>;
};

const PostCard = memo(({ data, className, ...props }: Props) => {
  const { id, text, author, media, createdAt } = data;
  const { profileImageUrl, screenName } = author;

  return (
    <Box
      as='article'
      className={twMerge(
        'cursor-pointer border-b border-border-1 px-4 py-3 outline-none transition duration-200 focus-visible:bg-[rgba(255,255,255,0.1)] focus-visible:shadow-focus',
        className
      )}
      {...props}
      tabIndex={0}
    >
      <Box className='relative flex-row items-start'>
        <Avatar
          href={ROUTES.PROFILE.DETAILS(screenName)}
          src={profileImageUrl}
          screenName={screenName}
        />
        <Box className='grow gap-1'>
          <PostCardAuthor id={id} author={author} createdAt={createdAt}>
            <PostCardDropdown />
          </PostCardAuthor>
          <Box className='mt-0.5'>
            <PostCardText id={id} text={text} author={author} />
            {!!media.length && <PostCardMedia media={media} />}
            <PostCardActions />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default PostCard;
