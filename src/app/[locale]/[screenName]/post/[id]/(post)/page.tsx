'use client';

import React from 'react';

import ErrorState from '@/components/atoms/ErrorState';
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
  const { data, isLoading, isError } = useGetPostQuery({ id });

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!data) return <span>brak posta</span>;

  return <PostDetail post={data} />;
};

export default PostPage;
