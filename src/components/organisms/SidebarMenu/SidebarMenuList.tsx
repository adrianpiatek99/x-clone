'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import Logo from '@/components/atoms/Logo';
import { ROUTES } from '@/constants/routes';
import { useAppSession } from '@/hooks/useAppSession';
import { usePathname } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth';
import { useCreatePostStore } from '@/stores/createPost';
import { useTranslations } from 'next-intl';

import { sidebarMenuItems } from './config';
import SidebarMenuListItem from './SidebarMenuListItem';

const SidebarMenuList = () => {
  const t = useTranslations();
  const { user } = useAppSession();
  const updateAuth = useAuthStore((state) => state.update);
  const updateCreatePostModal = useCreatePostStore((state) => state.updateModal);
  const pathname = usePathname();

  const handleOpenAuthModal = () => updateAuth({ isModalOpen: true });

  const handleOpenCreatePostModal = () => updateCreatePostModal({ isOpen: true });

  return (
    <Box
      as='nav'
      role='navigation'
      aria-label='Main navigation'
      className='mt-0.5 items-center gap-2 xl:items-start'
    >
      <Logo href={ROUTES.HOME} className='size-[50px]' size='xl' />
      <Box as='ul' className='w-full gap-2'>
        {sidebarMenuItems({ t, user, pathname }).map(({ text, ...props }) => (
          <SidebarMenuListItem key={text} text={text} {...props} />
        ))}
        {user ? (
          <>
            <Button
              className='mt-2 hidden rounded-full xl:flex'
              onClick={handleOpenCreatePostModal}
              size='large'
            >
              {t('post.actions.send')}
            </Button>
            <Button
              className='mx-auto mt-2 flex p-3 xl:hidden'
              onClick={handleOpenCreatePostModal}
              aria-label={t('post.actions.send')}
            >
              <Icon name='PlusIcon' className='size-[34px]' />
            </Button>
          </>
        ) : (
          <>
            <Button
              className='mt-2 hidden rounded-full xl:flex'
              onClick={handleOpenAuthModal}
              size='large'
            >
              {t('auth.signIn')}
            </Button>
            <Button
              className='mx-auto mt-2 flex p-3 xl:hidden'
              onClick={handleOpenAuthModal}
              aria-label={t('auth.signIn')}
            >
              <Icon name='LoginIcon' className='size-[26px]' />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarMenuList;
