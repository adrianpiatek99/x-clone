import React from 'react';

import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';
import { useAppSession } from '@/hooks/useAppSession';
import { usePathname } from '@/i18n/routing';
import { LogoutIcon } from '@/icons';
import { useAuthStore } from '@/stores/auth';
import { useGlobalStore } from '@/stores/global';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { navigationDrawerItems } from './config';
import NavigationDrawerListItem from './NavigationDrawerListItem';

const NavigationDrawerList = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { user } = useAppSession();
  const { updateMobileDrawer, updateLogoutModal } = useGlobalStore(
    useShallow((state) => ({
      updateMobileDrawer: state.updateMobileDrawer,
      updateLogoutModal: state.updateLogoutModal,
    }))
  );
  const updateAuth = useAuthStore((state) => state.update);

  const handleClose = () => updateMobileDrawer({ isOpen: false });

  const handleOpenLogoutModal = () => {
    updateMobileDrawer({ isOpen: false });
    updateLogoutModal({ isOpen: true });
  };

  const handleOpenAuthModal = () => {
    updateMobileDrawer({ isOpen: false });
    updateAuth({ isModalOpen: true });
  };

  return (
    <Box as='nav' className='gap-0 pt-4'>
      <Box as='ul' className='gap-0'>
        {navigationDrawerItems({ t, pathname, user }).map(({ ...props }) => (
          <NavigationDrawerListItem key={props.href} {...props} onClick={handleClose} />
        ))}
        {user && (
          <li>
            <Button
              className='h-[50px] w-full justify-start gap-5 rounded-none bg-transparent px-6 text-xl font-light [color:bg-foreground] [&>svg]:size-[26px]'
              onClick={handleOpenLogoutModal}
              startIcon={<LogoutIcon />}
              variant='gray'
              size='large'
            >
              {t('auth.logout.text')}
            </Button>
          </li>
        )}
      </Box>
      {!user && (
        <Button className='mx-6 mt-6 rounded-full' onClick={handleOpenAuthModal} size='large'>
          {t('auth.signIn')}
        </Button>
      )}
    </Box>
  );
};

export default NavigationDrawerList;
