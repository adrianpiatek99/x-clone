'use client';

import React from 'react';

import DataState from '@/components/molecules/DataState';
import { PostDetailSkeleton } from '@/components/molecules/PostDetail';
import { useGetPostDetailsQuery } from '@/hooks/api/posts/queries';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import type { PostPageParams } from './layout';

const LazyPostDetailsList = dynamic(() => import('./_components/PostDetailsList'), {
  loading: () => <PostDetailSkeleton />,
  ssr: false,
});
const LazyPostRepliesList = dynamic(() => import('./_components/PostRepliesList'), {
  ssr: false,
});

const PostPage = () => {
  const { id } = useParams<PostPageParams>();
  const { data, isLoading, isError } = useGetPostDetailsQuery({ id, enabled: false });

  return (
    <DataState isLoading={isLoading} isError={isError} loadingComponent={<PostDetailSkeleton />}>
      <LazyPostDetailsList posts={data.posts} />
      {!!data.posts.length && <LazyPostRepliesList />}
    </DataState>
  );
};

export default PostPage;
