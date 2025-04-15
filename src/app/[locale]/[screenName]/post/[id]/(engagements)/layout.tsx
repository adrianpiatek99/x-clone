'use client';

import type { PropsWithChildren } from 'react';
import React from 'react';

import Tabs, { Tab } from '@/components/molecules/Tabs';
import { ROUTES } from '@/constants/routes';
import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

type ParamsType = {
  screenName: string;
  id: string;
};

type Props = {
  params: Promise<ParamsType>;
};

const PostEngagementsLayout = ({ children, params }: PropsWithChildren<Props>) => {
  const unwrappedParams = React.use(params);
  const { screenName, id } = unwrappedParams;
  const t = useTranslations();
  const pathname = usePathname();
  const repostsPath = ROUTES.POST.REPOSTS(screenName, id);
  const likesPath = ROUTES.POST.LIKES(screenName, id);

  return (
    <div>
      <Tabs value={pathname}>
        <Tab value={repostsPath} href={repostsPath}>
          {t('postPage.tabs.reposts')}
        </Tab>
        <Tab value={likesPath} href={likesPath}>
          {t('postPage.tabs.likes')}
        </Tab>
      </Tabs>
      {children}
    </div>
  );
};

export default PostEngagementsLayout;
