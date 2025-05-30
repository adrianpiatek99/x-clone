import type { Ref } from 'react';
import React, { memo, useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import { ROUTES } from '@/constants/routes';
import { useRouter } from '@/i18n/routing';
import type { Post } from '@/types/post';
import { twMerge } from 'tailwind-merge';

import { PostCardActions, PostCardDropdown, PostCardMedia, PostCardText } from '../PostCard';
import PostDetailAdditionalInfo from './PostDetailAdditionalInfo';
import PostDetailAuthor from './PostDetailAuthor';

type Props = {
  post: Post;
  showThreadLineAbove?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement | null>;
};

const PostDetail = memo(({ post, showThreadLineAbove = false, className, ...props }: Props) => {
  const { id, text, media, createdAt, author, isAuthor, reply, editedAt } = post;
  const router = useRouter();
  const [isGlobalLoading] = useState(false);

  return (
    <Box className={twMerge('px-4 py-3', isGlobalLoading && 'opacity-50', className)} {...props}>
      <Box className='grow flex-row'>
        <Box className='relative shrink-0'>
          {showThreadLineAbove && (
            <div className='absolute left-1/2 top-0 -mt-6 h-5 w-0.5 grow -translate-x-1/2 bg-border-1' />
          )}
          <Avatar src={author.avatarUrl} href={ROUTES.PROFILE.DETAILS(author.screenName)} />
        </Box>
        <PostDetailAuthor author={author} />
        <PostCardDropdown
          post={{ id, text, author, media, isAuthor, reply }}
          onDeleteSuccess={() => router.back()}
        />
      </Box>
      <PostCardText text={text} truncate={false} />
      {media.length > 0 && <PostCardMedia media={media} />}
      <PostDetailAdditionalInfo createdAt={createdAt} editedAt={editedAt} />
      <PostCardActions post={post} />
    </Box>
  );
});

export default PostDetail;
