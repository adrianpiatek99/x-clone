import React from 'react';

import { Avatar, Box, Typography } from '@/components/atoms';
import UserDisplayName from '@/components/molecules/UserDisplayName';
import { ROUTES } from '@/constants/routes';
import { useAppSession } from '@/hooks/useAppSession';
import { useGlobalStore } from '@/stores/global';
import { useTranslations } from 'next-intl';

const NavigationDrawerHeader = () => {
  const t = useTranslations();
  const { user } = useAppSession();
  const updateMobileDrawer = useGlobalStore((state) => state.updateMobileDrawer);

  const handleClose = () => updateMobileDrawer({ isOpen: false });

  if (!user) return null;

  const profilePageHref = ROUTES.PROFILE.DETAILS(user.screenName);

  return (
    <div className='flex flex-col gap-2 px-6 pt-6'>
      <Box>
        <div className='w-fit' onClick={handleClose}>
          <Avatar src={user.profileImageUrl} href={profilePageHref} screenName={user.screenName} />
        </div>
      </Box>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-0.5'>
          <UserDisplayName
            name={user.name}
            isVerified={user.isVerified}
            href={profilePageHref}
            onClick={handleClose}
            size='l'
          />
          <Typography href={profilePageHref} onClick={handleClose} color='secondary' truncate>
            @{user.screenName}
          </Typography>
        </div>
        <div className='flex flex-wrap gap-x-5 gap-y-2.5'>
          <Typography
            className='truncate text-neutral-300'
            href={ROUTES.PROFILE.FOLLOWING(user.screenName)}
          >
            <Typography weight='bold'>0 </Typography>
            <Typography color='secondary'>{t('profilePage.following')}</Typography>
          </Typography>
          <Typography
            className='truncate text-neutral-300'
            href={ROUTES.PROFILE.FOLLOWERS(user.screenName)}
          >
            <Typography weight='bold'>0 </Typography>
            <Typography color='secondary'>{t('profilePage.followers')}</Typography>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NavigationDrawerHeader;
