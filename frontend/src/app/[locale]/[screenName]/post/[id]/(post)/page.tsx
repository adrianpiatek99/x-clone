'use client';

import React from 'react';

import DataState from '@/components/molecules/DataState';
import PostDetail, { PostDetailSkeleton } from '@/components/molecules/PostDetail';
import { useGetPostDetailsQuery } from '@/hooks/api/posts/queries';
import { useParams } from 'next/navigation';

import type { PostParams } from './layout';

const PostPage = () => {
  const { id } = useParams<PostParams>();
  const { data, isLoading, isError } = useGetPostDetailsQuery({ id, enabled: false });

  return (
    <DataState isLoading={isLoading} isError={isError} loadingComponent={<PostDetailSkeleton />}>
      {data && <PostDetail post={data} />}
    </DataState>
  );
};

export default PostPage;
