'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import Typography from '@/components/atoms/Typography';
import UserDisplayName from '@/components/molecules/UserDisplayName';
import { useGetUserByScreenNameQuery } from '@/hooks/api/profile/queries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { ProfileParams } from '../../layout';
import { ProfileHeroActions } from './ProfileHeroActions';
import { ProfileHeroAvatar } from './ProfileHeroAvatar';
import { ProfileHeroBanner } from './ProfileHeroBanner';
import { ProfileHeroInfo } from './ProfileHeroInfo';

const ProfileHero = () => {
  const t = useTranslations();
  const { screenName } = useParams<ProfileParams>();
  const { data, isLoading, isEmpty } = useGetUserByScreenNameQuery({
    screenName,
    enabled: false,
  });

  return (
    <Box className='gap-0'>
      <ProfileHeroBanner bannerUrl={data?.bannerUrl ?? ''} isLoading={isLoading} />
      <Box className='px-4 pb-4 pt-3'>
        <Box className='flex flex-row flex-wrap items-start justify-between gap-y-2'>
          <ProfileHeroAvatar avatarUrl={data?.avatarUrl ?? ''} isLoading={isLoading} />
          {data && <ProfileHeroActions />}
        </Box>
        {isEmpty ? (
          <Box className='gap-1'>
            <UserDisplayName name={`@${screenName}`} size='xl' verifiedClassName='size-[18px]' />
            <Box className='mx-auto my-14 w-full max-w-[400px] gap-2 px-4 py-3'>
              <Typography size='4xl' weight='bold'>
                {t('profilePage.notFound.title')}
              </Typography>
              <Typography color='secondary'>{t('profilePage.notFound.description')}</Typography>
            </Box>
          </Box>
        ) : (
          <ProfileHeroInfo />
        )}
      </Box>
    </Box>
  );
};

export default ProfileHero;
