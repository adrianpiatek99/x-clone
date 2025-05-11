import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard from '@/components/molecules/PostCard';
import { VirtualScrollKeys } from '@/stores/virtualScroll';
import type { Post } from '@/types/post';
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
      scrollKey={VirtualScrollKeys.FOLLOWING_TIMELINE}
    />
  );
};

export default FollowingPostsTimeline;
