'use client';

import React from 'react';

import Loader from '@/components/atoms/Loader';
import FlatList from '@/components/molecules/FlatList';
import ProfileCard from '@/components/molecules/ProfileCard';
import { useGetUserFollowersQuery } from '@/hooks/api/users/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileFollowsParams } from '../layout';

export default function Page() {
  const t = useTranslations();
  const { screenName } = useParams<ProfileFollowsParams>();
  const { flatData, ...restResult } = useGetUserFollowersQuery({ screenName });

  return (
    <FlatList
      data={flatData}
      renderItem={(item) => <ProfileCard user={item} />}
      infiniteScroll={{
        loader: (
          <div className='my-6'>
            <Loader center />
          </div>
        ),
        ...restResult,
      }}
      empty={{
        title: t('profilePage.subpages.followers.empty.title'),
        description: t('profilePage.subpages.followers.empty.description'),
      }}
    />
  );
}
