import React, { lazy, Suspense } from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import { useGetGlobalTimelineQuery } from '@/hooks/api/posts/useGetGlobalTimelineQuery';
import { useTranslations } from 'next-intl';

const LazyTrackNewPosts = lazy(() => import('../TrackNewPosts'));

const GlobalPostsTimeline = () => {
  const t = useTranslations();
  const { flatData, ...restResult } = useGetGlobalTimelineQuery();
  const latestPostId = flatData[0]?.id;

  return (
    <div className='relative flex h-full flex-col'>
      <Suspense fallback={<div>loadingggggg</div>}>
        {latestPostId && (
          <LazyTrackNewPosts latestPostId={latestPostId} refetch={restResult.refetch} />
        )}
      </Suspense>
      <FlatList
        data={flatData}
        renderItem={(item) => <PostCard post={item} />}
        empty={{
          title: t('homePage.globalPosts.empty.title'),
          description: t('homePage.globalPosts.empty.description'),
        }}
        infiniteScroll={{
          loader: <PostCardSkeletons />,
          ...restResult,
        }}
      />
    </div>
  );
};

export default GlobalPostsTimeline;
