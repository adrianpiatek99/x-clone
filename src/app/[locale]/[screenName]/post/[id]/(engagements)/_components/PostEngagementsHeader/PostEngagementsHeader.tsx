'use client';

import React from 'react';

import HeaderBar from '@/components/molecules/HeaderBar';
import Tabs, { Tab } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

type Params = {
  screenName: string;
  id: string;
};

type Props = {
  params: Params;
};

const PostEngagementsHeader = ({ params: { id, screenName } }: Props) => {
  const t = useTranslations();
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
