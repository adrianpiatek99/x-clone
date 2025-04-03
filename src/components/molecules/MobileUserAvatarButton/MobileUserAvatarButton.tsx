import React from 'react';

import { Avatar } from '@/components/atoms';
import { useAppSession } from '@/hooks/useAppSession';
import { useGlobalStore } from '@/stores/global';
import { twMerge } from 'tailwind-merge';
import { useShallow } from 'zustand/shallow';

const MobileUserAvatarButton = () => {
  const { user } = useAppSession();
  const { mobileDrawer, updateMobileDrawer } = useGlobalStore(
    useShallow((state) => ({
      mobileDrawer: state.mobileDrawer,
      updateMobileDrawer: state.updateMobileDrawer,
    }))
  );

  const handleOpenMobileDrawer = () => updateMobileDrawer({ isOpen: !mobileDrawer.isOpen });

  if (!user) return null;

  return (
    <button className='flex w-full items-center justify-center' onClick={handleOpenMobileDrawer}>
      <Avatar
        className={twMerge(
          'size-[28px] rounded-full ring-0 duration-200',
          mobileDrawer.isOpen && 'ring-2 ring-primary'
        )}
        src={user.profileImageUrl}
        screenName={user.screenName}
        size='small'
      />
    </button>
  );
};

export default MobileUserAvatarButton;
