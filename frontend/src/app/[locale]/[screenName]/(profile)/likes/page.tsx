'use client';

import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostCard, { PostCardSkeletons } from '@/components/molecules/PostCard';
import ScrollToTop from '@/components/molecules/ScrollToTop';
import { useGetUserLikesQuery } from '@/hooks/api/posts/queries/useGetUserLikesQuery';
import { VirtualScrollKeys } from '@/stores/virtualScroll';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfilePageParams } from '../../layout';

export default function LikesPage() {
  const t = useTranslations();
  const { screenName } = useParams<ProfilePageParams>();
  const { flatData, ...restResult } = useGetUserLikesQuery({ screenName });

  return (
    <>
      <ScrollToTop />
      <FlatList
        data={flatData}
        renderItem={(item) => <PostCard post={item} showReplyStatus />}
        empty={{
          title: t('profilePage.subpages.likes.empty.title'),
          description: t('profilePage.subpages.likes.empty.description'),
        }}
        infiniteScroll={{
          loader: <PostCardSkeletons />,
          ...restResult,
        }}
        scrollKey={VirtualScrollKeys.USER_LIKES}
      />
    </>
  );
}
