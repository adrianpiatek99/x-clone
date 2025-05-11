'use client';

import React from 'react';

import Loader from '@/components/atoms/Loader';
import FlatList from '@/components/molecules/FlatList';
import ProfileCard from '@/components/molecules/ProfileCard';
import { useGetPostLikesQuery } from '@/hooks/api/posts/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { PostParams } from '../../(post)/layout';

export default function PostLikesPage() {
  const { id } = useParams<PostParams>();
  const t = useTranslations();
  const { flatData, ...restResult } = useGetPostLikesQuery({ postId: id });

  return (
    <FlatList
      data={flatData}
      renderItem={(item) => <ProfileCard user={item.user} />}
      empty={{
        title: t('postPage.likes.empty.title'),
        description: t('postPage.likes.empty.description'),
      }}
      infiniteScroll={{
        loader: (
          <div className='my-6'>
            <Loader center />
          </div>
        ),
        ...restResult,
      }}
    />
  );
}
