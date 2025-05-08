import React from 'react';
import { Toaster } from 'react-hot-toast';

import { useAuth } from '@/components/context/AuthContext';
import dynamic from 'next/dynamic';

const LazyAuthModal = dynamic(() => import('@/components/organisms/AuthModal'), {
  ssr: false,
});
const LazyAuthRequiredModal = dynamic(() => import('@/components/organisms/AuthRequiredModal'), {
  ssr: false,
});
const LazyNavigationDrawer = dynamic(() => import('@/components/organisms/NavigationDrawer'), {
  ssr: false,
});
const LazyLogoutConfirmModal = dynamic(() => import('@/components/molecules/LogoutConfirmModal'), {
  ssr: false,
});
const LazyNavigationTabs = dynamic(() => import('@/components/organisms/NavigationTabs'), {
  ssr: false,
});
const LazyCreatePostFormModal = dynamic(
  () => import('@/components/organisms/CreatePostFormModal'),
  {
    ssr: false,
  }
);

export default function Modals() {
  const { user } = useAuth();

  return (
    <>
      {!user && <LazyAuthModal />}
      {!user && <LazyAuthRequiredModal />}
      {user && <LazyLogoutConfirmModal />}
      <LazyNavigationDrawer />
      <LazyNavigationTabs />
      {user && <LazyCreatePostFormModal />}
      <Toaster position='bottom-center' />
    </>
  );
}
