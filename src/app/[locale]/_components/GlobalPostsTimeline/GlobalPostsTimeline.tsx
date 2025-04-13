import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import { useGlobalPostsTimelineQuery } from '@/hooks/api/posts/useGlobalPostsTimelineQuery';
import { useTranslations } from 'next-intl';

const GlobalPostsTimeline = () => {
  const t = useTranslations();
  const { flatData, ...restResult } = useGlobalPostsTimelineQuery();

  return (
    <FlatList
      data={flatData}
      renderItem={(item) => <PostCard data={item} />}
      empty={t('homePage.posts.empty')}
      infiniteScroll={{
        loader: <PostCardSkeletons />,
        ...restResult,
      }}
    />
  );
};

export default GlobalPostsTimeline;
