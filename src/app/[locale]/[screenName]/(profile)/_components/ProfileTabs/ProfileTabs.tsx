'use client';

import React, { memo } from 'react';

import Tabs, { Tab } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../../layout';

const ProfileTabs = memo(() => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const pathname = usePathname();
  const postsPath = ROUTES.PROFILE.DETAILS(screenName);
  const repliesPath = ROUTES.PROFILE.REPLIES(screenName);
  const mediaPath = ROUTES.PROFILE.MEDIA(screenName);
  const likesPath = ROUTES.PROFILE.LIKES(screenName);

  return (
    <Tabs value={pathname}>
      <Tab value={postsPath} href={postsPath}>
        {t('profilePage.tabs.posts')}
      </Tab>
      <Tab value={repliesPath} href={repliesPath}>
        {t('profilePage.tabs.replies')}
      </Tab>
      <Tab value={mediaPath} href={mediaPath}>
        {t('profilePage.tabs.media')}
      </Tab>
      <Tab value={likesPath} href={likesPath}>
        {t('profilePage.tabs.likes')}
      </Tab>
    </Tabs>
  );
});

export default ProfileTabs;
