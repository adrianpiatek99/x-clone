'use client';

import React from 'react';

import HeaderBar from '@/components/molecules/HeaderBar';
import Tabs, { Tab } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileFollowsParams } from '../../layout';

const ProfileFollowsHeader = () => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileFollowsParams>();
  const { data } = useGetUserByScreenNameQuery({ screenName });
  const pathname = usePathname();
  const followersPath = ROUTES.PROFILE.FOLLOWERS(screenName);
  const followingPath = ROUTES.PROFILE.FOLLOWING(screenName);

  return (
    <HeaderBar showBackButton title={data?.name ?? ''} subtitle={`@${screenName}`}>
      <Tabs value={pathname}>
        <Tab value={followersPath} href={followersPath}>
          {t('profilePage.tabs.followers')}
        </Tab>
        <Tab value={followingPath} href={followingPath}>
          {t('profilePage.tabs.following')}
        </Tab>
      </Tabs>
    </HeaderBar>
  );
};

export default ProfileFollowsHeader;
