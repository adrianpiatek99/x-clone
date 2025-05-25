'use client';

import React, { useEffect, useRef } from 'react';

import DataState from '@/components/molecules/DataState';
import PostCard from '@/components/molecules/PostCard';
import PostDetail, { PostDetailSkeleton } from '@/components/molecules/PostDetail';
import { ROUTES } from '@/constants/routes';
import { useGetPostDetailsQuery } from '@/hooks/api/posts/queries';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

import PostRepliesList from './_components/PostRepliesList';
import type { PostPageParams } from './layout';

const PostPage = () => {
  const { id } = useParams<PostPageParams>();
  const router = useRouter();
  const { data, isLoading, isError } = useGetPostDetailsQuery({ id, enabled: false });
  const postDetailRef = useRef<HTMLDivElement>(null);

  const handleDeletePostSuccess = () => router.replace(ROUTES.HOME);

  useEffect(() => {
    if (!isLoading && postDetailRef.current) {
      const elementPosition = postDetailRef.current.getBoundingClientRect().top;
      const headerBar = document.getElementById('header-bar');
      const offsetPosition = elementPosition + window.pageYOffset - (headerBar?.offsetHeight ?? 0);

      window.scrollTo({
        top: offsetPosition,
      });
    }
  }, [isLoading]);

  return (
    <DataState isLoading={isLoading} isError={isError} loadingComponent={<PostDetailSkeleton />}>
      {data.posts.map((post, index) => {
        const isFirstPost = index === 0;
        const isLastPost = index === data.posts.length - 1;

        if (isLastPost)
          return (
            <PostDetail
              key={post.id}
              ref={postDetailRef}
              post={post}
              showThreadLineAbove={data.posts.length > 1 && isLastPost}
            />
          );

        return (
          <PostCard
            key={post.id}
            className='border-b-0'
            post={post}
            showThreadLineAbove={!isFirstPost && !isLastPost}
            showThreadLineBelow
            onDeleteSuccess={handleDeletePostSuccess}
          />
        );
      })}
      {!!data.posts.length && <PostRepliesList />}
    </DataState>
  );
};

export default PostPage;
