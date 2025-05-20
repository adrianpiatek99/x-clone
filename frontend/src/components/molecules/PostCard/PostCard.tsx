import type { ComponentPropsWithRef, RefCallback } from 'react';
import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import { ROUTES } from '@/constants/routes';
import type { Post } from '@/types/post';
import { twMerge } from 'tailwind-merge';

import ArticleCard from '../ArticleCard';
import { PostCardActions } from './PostCardActions';
import { PostCardAuthor } from './PostCardAuthor';
import { PostCardDropdown } from './PostCardDropdown';
import { PostCardMedia } from './PostCardMedia';
import { PostCardStatuses } from './PostCardStatuses';
import { PostCardText } from './PostCardText';

type Props = ComponentPropsWithRef<'div'> & {
  post: Post;
  ref?: RefCallback<HTMLDivElement>;
};

const PostCard = memo(({ post, className, ...props }: Props) => {
  const { id, text, author, media, createdAt, isAuthor, isLiked, likesCount, editedAt } = post;
  const { avatarUrl, screenName } = author;

  return (
    <ArticleCard
      className={twMerge('border-b border-border-1', className)}
      href={ROUTES.POST.DETAILS(screenName, id)}
      {...props}
    >
      <Box className='relative flex-row items-start'>
        <Avatar href={ROUTES.PROFILE.DETAILS(screenName)} src={avatarUrl} screenName={screenName} />
        <Box className='grow gap-1.5'>
          <Box className='flex-row items-center justify-between gap-1'>
            <PostCardAuthor id={id} author={author} createdAt={createdAt} />
            <PostCardDropdown post={{ id, author, text, media, isAuthor }} />
          </Box>
          <Box>
            <Box className='gap-1.5'>
              <PostCardStatuses editedAt={editedAt} />
              <PostCardText id={id} text={text} author={author} />
            </Box>
            {!!media.length && <PostCardMedia media={media} />}
            <PostCardActions id={id} isLiked={isLiked} likesCount={likesCount} />
          </Box>
        </Box>
      </Box>
    </ArticleCard>
  );
});

export default PostCard;
