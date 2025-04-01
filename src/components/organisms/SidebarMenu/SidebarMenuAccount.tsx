import React, { memo, useCallback, useState } from 'react';

import { Avatar, Box, Button, Dropdown, DropdownItem, Typography } from '@/components/atoms';
import { useAppSession } from '@/hooks/useAppSession';
import { LogoutIcon, MoreHorizontalIcon } from '@/icons';
import dynamic from 'next/dynamic';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const LazyConfirmModal = dynamic(() =>
  import('@/components/atoms').then((mod) => mod.ConfirmModal)
);

export const SidebarMenuAccount = memo(() => {
  const t = useTranslations();
  const { user } = useAppSession();
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const handleLogout = useCallback(() => {
    setIsConfirmLogoutOpen(false);
    signOut();
  }, []);

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
              <Typography className='inline-flex items-center'>
                <Typography weight='bold' truncate>
                  {user.name}
                </Typography>
                {/* {user.isVerified && <VerifiedCheckmark />} */}
              </Typography>
              <Typography color='secondary' truncate>
                @{user.screenName}
              </Typography>
            </Box>
            <div className='hidden items-center xl:flex [&>svg]:size-[20px]'>
              <MoreHorizontalIcon className='text-text-1' />
            </div>
          </Box>
        </Button>
        <DropdownItem onClick={() => setIsConfirmLogoutOpen(true)} icon={<LogoutIcon />} danger>
          {t('auth.logout.text')}
        </DropdownItem>
      </Dropdown>
      <LazyConfirmModal
        title={t('auth.logout.confirmModal.title')}
        description={t('auth.logout.confirmModal.description')}
        acceptButtonText={t('auth.logout.text')}
        isOpen={isConfirmLogoutOpen}
        onClose={() => setIsConfirmLogoutOpen(false)}
        onAccept={handleLogout}
      />
    </Box>
  );
});
