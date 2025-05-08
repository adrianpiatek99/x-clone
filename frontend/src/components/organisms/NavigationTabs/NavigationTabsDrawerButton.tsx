import React from 'react';

import Avatar from '@/components/atoms/Avatar';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { useAuth } from '@/components/context/AuthContext';
import { useGlobalStore } from '@/stores/global';
import { twMerge } from 'tailwind-merge';
import { useShallow } from 'zustand/shallow';

export const NavigationTabsDrawerButton = () => {
  const { user } = useAuth();
  const { mobileDrawer, updateMobileDrawer } = useGlobalStore(
    useShallow((state) => ({
      mobileDrawer: state.mobileDrawer,
      updateMobileDrawer: state.updateMobileDrawer,
    }))
  );

  const handleOpenMobileDrawer = () => updateMobileDrawer({ isOpen: !mobileDrawer.isOpen });

  return user ? (
    <button className='flex w-full justify-center py-[7px]' onClick={handleOpenMobileDrawer}>
      <Avatar
        className={twMerge(
          'size-[28px] rounded-full ring-0 duration-200',
          mobileDrawer.isOpen && 'ring-2 ring-primary'
        )}
        src={user.avatarUrl}
        screenName={user.screenName}
        size='small'
      />
    </button>
  ) : (
    <div
      className='flex w-full items-center justify-center'
      onClick={handleOpenMobileDrawer}
      role='button'
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOpenMobileDrawer();
        }
      }}
    >
      <IconButton color='white' size='large' aria-label='Menu'>
        <Icon name='MenuIcon' />
      </IconButton>
    </div>
  );
};
