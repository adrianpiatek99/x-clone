import React from 'react';
import { Toaster } from 'react-hot-toast';

import { useAppSession } from '@/hooks/useAppSession';
import dynamic from 'next/dynamic';

const LazyAuthModal = dynamic(() => import('@/components/organisms/AuthModal'));

const Modals = () => {
  const { user } = useAppSession();

  return (
    <>
      {!user && <LazyAuthModal />}
      <Toaster position='bottom-center' />
    </>
  );
};

export default Modals;
