'use client';

import React, { useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import ErrorState from '@/components/atoms/ErrorState';
import {
  PostCardActions,
  PostCardDropdown,
  PostCardMedia,
  PostCardText,
} from '@/components/molecules/PostCard';
import { useGetPostQuery } from '@/hooks/api/posts/useGetPostQuery';

import PostAdditionalInfo from './_components/PostAdditionalInfo';
import PostAuthor from './_components/PostAuthor';
import PostSkeleton from './_components/PostSkeleton';

type Params = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<Params>;
};

const PostPage = ({ params }: Props) => {
  const { id, screenName } = React.use(params);
  const { data, isLoading, isFetching, isError } = useGetPostQuery({ id });
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  const { text, media, createdAt, isLiked, likesCount, author, isAuthor } = data;

  return (
    <Box className='px-4 py-3'>
      <Box className='grow flex-row'>
        <Avatar src={data.author.avatarUrl} />
        <PostAuthor author={data.author}>
          <PostCardDropdown
            id={id}
            author={author}
            isAuthor={isAuthor}
            setIsLoading={setIsGlobalLoading}
          />
        </PostAuthor>
      </Box>
      <PostCardText id={id} text={text} author={author} truncate={false} />
      {media.length > 0 && <PostCardMedia media={media} />}
      <PostAdditionalInfo createdAt={createdAt} />
      <PostCardActions id={id} isLiked={isLiked} likesCount={likesCount} />
    </Box>
  );
};

export default PostPage;
