'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Box from '@/components/atoms/Box';
import HeaderBar from '@/components/molecules/HeaderBar';
import ScrollToTop from '@/components/molecules/ScrollToTop';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ProfileHero from './_components/ProfileHero';
import ProfileTabs from './_components/ProfileTabs';

export type ProfileParams = {
  screenName: string;
};

export default function Layout({ children }: PropsWithChildren) {
  const { screenName } = useParams<ProfileParams>();
  const t = useTranslations();
  const { data, isRefetching } = useGetUserByScreenNameQuery({
    screenName,
  });
  const headerSubtitle = data?.postsCount
    ? t('post.count.posts', { count: data.postsCount })
    : undefined;

  return (
    <Box className='min-h-screen gap-0'>
      <ScrollToTop />
      <HeaderBar
        showBackButton
        title={screenName}
        subtitle={headerSubtitle}
        isRefetching={isRefetching}
      />
      <ProfileHero />
      {data && <ProfileTabs />}
      {data && children}
    </Box>
  );
}
