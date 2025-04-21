import React, { useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import type { Post } from '@/db/schema';
import { useRouter } from '@/i18n/routing';
import { twMerge } from 'tailwind-merge';

import { PostCardActions, PostCardDropdown, PostCardMedia, PostCardText } from '../PostCard';
import PostDetailAdditionalInfo from './PostDetailAdditionalInfo';
import PostDetailAuthor from './PostDetailAuthor';

type Props = {
  post: Post;
};

const PostDetail = ({
  post: { id, text, media, createdAt, isLiked, likesCount, author, isAuthor, editedAt },
}: Props) => {
  const router = useRouter();
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  return (
    <Box className={twMerge('px-4 py-3', isGlobalLoading && 'opacity-50')}>
      <Box className='grow flex-row'>
        <Avatar src={author.avatarUrl} />
        <PostDetailAuthor author={author} />
        <PostCardDropdown
          post={{ id, text, author, media, isAuthor }}
          setIsLoading={setIsGlobalLoading}
          onDeleteSuccess={() => router.back()}
        />
      </Box>
      <PostCardText id={id} text={text} author={author} truncate={false} />
      {media.length > 0 && <PostCardMedia media={media} />}
      <PostDetailAdditionalInfo createdAt={createdAt} editedAt={editedAt} />
      <PostCardActions id={id} isLiked={isLiked} likesCount={likesCount} />
    </Box>
  );
};

export default PostDetail;
