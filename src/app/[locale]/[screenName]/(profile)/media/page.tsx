'use client';

import React from 'react';

import FlatList from '@/components/molecules/FlatList';
import PostMediaGridCard, {
  PostMediaGridCardSkeleton,
} from '@/components/molecules/PostMediaGridCard';
import ScrollToTop from '@/components/molecules/ScrollToTop';
import { useGetUserMediaQuery } from '@/hooks/api/posts/queries/useGetUserMediaQuery';
import { VirtualScrollKeys } from '@/stores/virtualScroll';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../layout';

export default function MediaPage() {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const { flatData, ...restResult } = useGetUserMediaQuery({ screenName });

  return (
    <>
      <ScrollToTop />
      <FlatList
        data={flatData}
        renderItem={(item) => <PostMediaGridCard post={item} />}
        empty={{
          title: t('profilePage.subpages.media.empty.title'),
          description: t('profilePage.subpages.media.empty.description'),
        }}
        infiniteScroll={{
          loader: <PostMediaGridCardSkeleton />,
          ...restResult,
        }}
        isGrid
        scrollKey={VirtualScrollKeys.USER_MEDIA}
      />
    </>
  );
}
