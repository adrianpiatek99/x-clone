'use client';

import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';

import Box from '@/components/atoms/Box';
import HeaderBar from '@/components/molecules/HeaderBar';
import ScrollToTop from '@/components/molecules/ScrollToTop';
import { ROUTES } from '@/constants/routes';
import { useGetUserLikesQuery } from '@/hooks/api/posts/queries/useGetUserLikesQuery';
import { useGetUserMediaQuery } from '@/hooks/api/posts/queries/useGetUserMediaQuery';
import { useGetUserPostsQuery } from '@/hooks/api/posts/queries/useGetUserPostsQuery';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ProfileHero from './_components/ProfileHero';
import ProfileTabs from './_components/ProfileTabs';

export type ProfileParams = {
  screenName: string;
};

export default function Layout({ children }: PropsWithChildren) {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const pathname = usePathname();
  const { data, isRefetching } = useGetUserByScreenNameQuery({
    screenName,
  });
  const { data: postsData } = useGetUserPostsQuery({ screenName, enabled: false });
  const { data: mediaData } = useGetUserMediaQuery({ screenName, enabled: false });
  const { data: likesData } = useGetUserLikesQuery({ screenName, enabled: false });

  const headerSubtitle = useMemo(() => {
    switch (pathname) {
      case ROUTES.PROFILE.MEDIA(screenName):
        return mediaData && t('post.count.media', { count: mediaData.pages[0].totalCount });
      case ROUTES.PROFILE.REPLIES(screenName):
        return likesData && t('post.count.replies', { count: 0 });
      case ROUTES.PROFILE.LIKES(screenName):
        return likesData && t('post.count.likes', { count: likesData.pages[0].totalCount });
      default:
        return postsData && t('post.count.posts', { count: postsData?.pages[0].totalCount });
    }
  }, [t, pathname, mediaData, likesData, postsData, screenName]);

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
