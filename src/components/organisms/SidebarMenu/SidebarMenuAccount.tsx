import React, { memo, useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Dropdown, { DropdownItem } from '@/components/atoms/Dropdown';
import Typography from '@/components/atoms/Typography';
import UserDisplayName from '@/components/molecules/UserDisplayName';
import { useAppSession } from '@/hooks/useAppSession';
import { EditProfileIcon, LogoutIcon, MoreHorizontalIcon } from '@/icons';
import { useGlobalStore } from '@/stores/global';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const LazyEditProfileModal = dynamic(() => import('../EditProfileModal'));

export const SidebarMenuAccount = memo(() => {
  const t = useTranslations();
  const { user } = useAppSession();
  const updateLogoutModal = useGlobalStore((state) => state.updateLogoutModal);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleOpenLogoutModal = () => updateLogoutModal({ isOpen: true });

  if (!user) return null;

  return (
    <Box className='my-3'>
      <Dropdown menuItems={{ className: 'origin-bottom-left', anchorTo: 'bottom start' }}>
        <Button
          className='min-h-full justify-start bg-transparent p-3 [&>span]:w-full'
          variant='gray'
          fullWidth
        >
          <Box className='relative h-[40px] flex-row items-center text-left'>
            <Avatar src={user.profileImageUrl} />
            <Box className='hidden h-full grow justify-between gap-0 xl:flex'>
              <UserDisplayName name={user.name} isVerified={user.isVerified} />
              <Typography color='secondary' truncate>
                @{user.screenName}
              </Typography>
            </Box>
            <div className='hidden items-center xl:flex [&>svg]:size-[20px]'>
              <MoreHorizontalIcon className='text-text-1' />
            </div>
          </Box>
        </Button>
        <DropdownItem onClick={() => setIsEditProfileModalOpen(true)} icon={<EditProfileIcon />}>
          {t('profilePage.actions.edit')}
        </DropdownItem>
        <DropdownItem onClick={handleOpenLogoutModal} icon={<LogoutIcon />} danger>
          {t('auth.logout.text')}
        </DropdownItem>
      </Dropdown>
      <LazyEditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
      />
    </Box>
  );
});
