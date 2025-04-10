import React from 'react';
import { Toaster } from 'react-hot-toast';

import { useAppSession } from '@/hooks/useAppSession';
import dynamic from 'next/dynamic';

const LazyAuthModal = dynamic(() => import('@/components/organisms/AuthModal'));
const LazyNavigationDrawer = dynamic(() => import('@/components/organisms/NavigationDrawer'));
const LazyLogoutConfirmModal = dynamic(() => import('@/components/molecules/LogoutConfirmModal'));
const LazyNavigationTabs = dynamic(() => import('@/components/organisms/NavigationTabs'));
const LazyCreatePostFormModal = dynamic(() => import('@/components/organisms/CreatePostFormModal'));
const Modals = () => {
  const { user } = useAppSession();

  return (
    <>
      {!user && <LazyAuthModal />}
      {user && <LazyLogoutConfirmModal />}
      <LazyNavigationDrawer />
      <LazyNavigationTabs />
      {user && <LazyCreatePostFormModal />}
      <Toaster position='bottom-center' />
    </>
  );
};

export default Modals;
