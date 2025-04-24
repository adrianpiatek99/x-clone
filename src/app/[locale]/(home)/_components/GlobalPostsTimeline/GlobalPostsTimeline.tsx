import React, { lazy, Suspense } from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import { useGetGlobalTimelineQuery } from '@/hooks/api/posts/useGetGlobalTimelineQuery';
import { useTranslations } from 'next-intl';

const LazyGlobalTrackNewPosts = lazy(() => import('./GlobalTrackNewPosts'));

const GlobalPostsTimeline = () => {
  const t = useTranslations();
  const { flatData, ...restResult } = useGetGlobalTimelineQuery();
  const latestPostId = flatData[0]?.id;

  return (
    <div className='flex flex-col'>
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
        additionalPillNotify={
          latestPostId && (
            <Suspense>
              <LazyGlobalTrackNewPosts latestPostId={latestPostId} refetch={restResult.refetch} />
            </Suspense>
          )
        }
        scrollKey='global-posts-timeline'
      />
    </div>
  );
};

export default GlobalPostsTimeline;
