import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard from '@/components/molecules/PostCard';
import type { Post } from '@/db/schema';
import { useTranslations } from 'next-intl';

const FollowingPostsTimeline = () => {
  const t = useTranslations();
  const flatData = [] as Post[];

  return (
    <FlatList
      data={flatData}
      renderItem={(item) => <PostCard post={item} />}
      empty={{
        title: t('homePage.followingPosts.empty.title'),
        description: t('homePage.followingPosts.empty.description'),
      }}
      scrollKey='following-posts-timeline'
    />
  );
};

export default FollowingPostsTimeline;
