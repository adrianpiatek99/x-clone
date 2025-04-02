import React from 'react';
import { Toaster } from 'react-hot-toast';

import { useAppSession } from '@/hooks/useAppSession';
import dynamic from 'next/dynamic';

const LazyAuthModal = dynamic(() => import('@/components/organisms/AuthModal'));
const LazyNavigationDrawer = dynamic(() => import('@/components/organisms/NavigationDrawer'));
const LazyLogoutConfirmModal = dynamic(() => import('@/components/molecules/LogoutConfirmModal'));
const Modals = () => {
  const { user } = useAppSession();

  return (
    <>
      {!user && <LazyAuthModal />}
      {user && <LazyLogoutConfirmModal />}
      <LazyNavigationDrawer />
      <Toaster position='bottom-center' />
    </>
  );
};

export default Modals;
