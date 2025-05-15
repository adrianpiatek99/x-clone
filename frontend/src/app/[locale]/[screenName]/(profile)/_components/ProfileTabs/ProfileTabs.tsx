'use client';

import React, { memo } from 'react';

import Tabs, { Tab } from '@/components/molecules/Tabs';
import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../../layout';
import { getProfileTabs } from './config';

const ProfileTabs = memo(() => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const pathname = usePathname();

  return (
    <Tabs value={pathname}>
      {getProfileTabs({ t, screenName }).map((tab) => (
        <Tab key={tab.value} {...tab} />
      ))}
    </Tabs>
  );
});

export default ProfileTabs;
