'use client';

import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import ScrollToTop from '@/components/molecules/ScrollToTop';
import { useGetUserPostsQuery } from '@/hooks/api/posts/queries/useGetUserPostsQuery';
import { VirtualScrollKeys } from '@/stores/virtualScroll';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfilePageParams } from '../layout';

export default function ProfilePage() {
  const t = useTranslations();
  const { screenName } = useParams<ProfilePageParams>();
  const { flatData, ...restResult } = useGetUserPostsQuery({ screenName });

  return (
    <>
      <ScrollToTop />
      <FlatList
        data={flatData}
        renderItem={(item) => <PostCard post={item} />}
        empty={{
          title: t('profilePage.subpages.posts.empty.title'),
          description: t('profilePage.subpages.posts.empty.description'),
        }}
        infiniteScroll={{
          loader: <PostCardSkeletons />,
          ...restResult,
        }}
        scrollKey={VirtualScrollKeys.USER_POSTS}
      />
    </>
  );
}
