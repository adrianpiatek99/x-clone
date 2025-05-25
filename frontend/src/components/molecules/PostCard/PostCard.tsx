import type { ComponentPropsWithRef, Ref } from 'react';
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
  ref?: Ref<HTMLDivElement | null>;
  preview?: boolean;
  showReplyStatus?: boolean;
  showThreadLineAbove?: boolean;
  showThreadLineBelow?: boolean;
  onDeleteSuccess?: () => void;
};

const PostCard = memo(
  ({
    post,
    className,
    preview = false,
    showReplyStatus = false,
    showThreadLineAbove = false,
    showThreadLineBelow = false,
    onDeleteSuccess,
    ...props
  }: Props) => {
    const { id, text, author, media, createdAt, isAuthor, reply, editedAt } = post;
    const { avatarUrl, screenName } = author;

    return (
      <ArticleCard
        className={twMerge('border-b border-border-1', className)}
        href={ROUTES.POST.DETAILS(screenName, id)}
        {...props}
      >
        <Box className='relative flex-row'>
          <Box className='relative shrink-0 gap-0'>
            {showThreadLineAbove && (
              <div className='absolute left-1/2 top-0 -mt-6 h-5 w-0.5 grow -translate-x-1/2 bg-border-1' />
            )}
            <Avatar
              href={ROUTES.PROFILE.DETAILS(screenName)}
              src={avatarUrl}
              screenName={screenName}
            />
            {showThreadLineBelow && <div className='mx-auto mt-1 h-full w-0.5 grow bg-border-1' />}
          </Box>
          <Box className='grow gap-1.5'>
            <Box className='flex-row items-center justify-between gap-1'>
              <PostCardAuthor id={id} author={author} createdAt={createdAt} preview={preview} />
              <PostCardDropdown
                post={{ id, author, text, media, isAuthor, reply }}
                onDeleteSuccess={onDeleteSuccess}
              />
            </Box>
            <Box>
              <Box className='gap-1.5'>
                <PostCardStatuses
                  reply={reply}
                  editedAt={editedAt}
                  showReplyStatus={showReplyStatus}
                />
                <PostCardText text={text} />
              </Box>
              {!!media.length && <PostCardMedia media={media} />}
              <PostCardActions post={post} />
            </Box>
          </Box>
        </Box>
      </ArticleCard>
    );
  }
);

export default PostCard;
