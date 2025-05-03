'use client';

import React from 'react';

import HeaderBar from '@/components/molecules/HeaderBar';
import Tabs, { Tab } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { PostParams } from '../../../(post)/layout';

const PostEngagementsHeader = () => {
  const t = useTranslations();
  const { id, screenName } = useParams<PostParams>();
  const pathname = usePathname();
  const repostsPath = ROUTES.POST.REPOSTS(screenName, id);
  const likesPath = ROUTES.POST.LIKES(screenName, id);

  return (
    <HeaderBar title={t('postPage.subpages.engagements.title')} showBackButton>
      <Tabs value={pathname}>
        <Tab value={repostsPath} href={repostsPath}>
          {t('postPage.subpages.engagements.tabs.reposts')}
        </Tab>
        <Tab value={likesPath} href={likesPath}>
          {t('postPage.subpages.engagements.tabs.likes')}
        </Tab>
      </Tabs>
    </HeaderBar>
  );
};

export default PostEngagementsHeader;
