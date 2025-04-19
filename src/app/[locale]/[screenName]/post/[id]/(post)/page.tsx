'use client';

import React from 'react';

import DataState from '@/components/molecules/DataState';
import PostDetail, { PostDetailSkeleton } from '@/components/molecules/PostDetail';
import { useGetPostQuery } from '@/hooks/api/posts/useGetPostQuery';

type Params = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<Params>;
};

const PostPage = ({ params }: Props) => {
  const { id } = React.use(params);
  const { data, isLoading, isRefetching, isError } = useGetPostQuery({ id });

  return (
    <DataState
      isLoading={isLoading}
      isError={isError}
      isRefetching={isRefetching}
      loadingComponent={<PostDetailSkeleton />}
    >
      {data && <PostDetail post={data} />}
    </DataState>
  );
};

export default PostPage;
