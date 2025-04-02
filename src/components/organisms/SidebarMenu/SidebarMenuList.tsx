import React from 'react';

import { Box, Button, IconButton, Logo } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';
import { useAppSession } from '@/hooks/useAppSession';
import { usePathname } from '@/i18n/routing';
import { LoginIcon } from '@/icons';
import { useAuthStore } from '@/stores/auth';
import { useTranslations } from 'next-intl';

import { authSidebarMenuItems, sidebarMenuHomeItem, sidebarMenuSettingsItem } from './config';
import SidebarMenuListItem from './SidebarMenuListItem';

const SidebarMenuList = () => {
  const t = useTranslations();
  const { user } = useAppSession();
  const updateAuth = useAuthStore((state) => state.update);
  const pathname = usePathname();

  const handleOpenAuthModal = () => updateAuth({ isModalOpen: true });

  return (
    <Box
      as='nav'
      role='navigation'
      aria-label='Main navigation'
      className='mt-0.5 items-center gap-2 xl:items-start'
    >
      <Logo href={ROUTES.HOME} className='size-[50px]' size='xl' />
      <Box as='ul' className='w-full gap-2'>
        <SidebarMenuListItem {...sidebarMenuHomeItem({ t, pathname })} />
        {user &&
          authSidebarMenuItems({ t, user, pathname }).map(({ text, ...props }) => (
            <SidebarMenuListItem key={text} text={text} {...props} />
          ))}
        <SidebarMenuListItem {...sidebarMenuSettingsItem({ t, pathname })} />
        {!user && (
          <>
            <Button
              className='hidden rounded-full xl:flex'
              onClick={handleOpenAuthModal}
              size='large'
            >
              {t('auth.signIn')}
            </Button>
            <IconButton
              className='mx-auto flex p-3 xl:hidden [&>svg]:size-[26px]'
              title={t('auth.signIn')}
              onClick={handleOpenAuthModal}
            >
              <LoginIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarMenuList;
