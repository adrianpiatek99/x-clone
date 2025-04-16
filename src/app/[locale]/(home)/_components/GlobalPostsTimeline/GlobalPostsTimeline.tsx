import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import { useGetGlobalTimelineQuery } from '@/hooks/api/posts/useGetGlobalTimelineQuery';
import { useTranslations } from 'next-intl';

const GlobalPostsTimeline = () => {
  const t = useTranslations();
  const { flatData, ...restResult } = useGetGlobalTimelineQuery();

  return (
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
  );
};

export default GlobalPostsTimeline;
