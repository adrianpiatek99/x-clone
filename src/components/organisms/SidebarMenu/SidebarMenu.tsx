'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import { useAppSession } from '@/hooks/useAppSession';

import { SidebarMenuAccount } from './SidebarMenuAccount';
import SidebarMenuList from './SidebarMenuList';

const SidebarMenu = () => {
  const { user } = useAppSession();

  return (
    <div className='hidden sm:flex sm:w-full sm:max-w-[88px] xl:max-w-[275px]'>
      <div className='hidden sm:fixed sm:inset-y-0 sm:flex sm:min-h-screen sm:w-full sm:max-w-[88px] sm:grow sm:flex-col xl:max-w-[275px]'>
        <Box className='h-full justify-between gap-2 px-3'>
          <SidebarMenuList />
          {user && <SidebarMenuAccount />}
        </Box>
      </div>
    </div>
  );
};

export default SidebarMenu;
