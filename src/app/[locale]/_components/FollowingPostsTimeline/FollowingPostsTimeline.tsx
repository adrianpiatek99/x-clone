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
      renderItem={(item) => <PostCard data={item} />}
      empty={t('homePage.posts.empty')}
    />
  );
};

export default FollowingPostsTimeline;
