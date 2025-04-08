import React from 'react';

import Box from '@/components/atoms/Box';
import Logo from '@/components/atoms/Logo';
import Modal from '@/components/atoms/Modal';
import { useAuthStore } from '@/stores/auth';
import { useShallow } from 'zustand/shallow';

import { AuthModalCurrentTab } from './AuthModalCurrentTab';

const AuthModal = () => {
  const { isModalOpen, update, resetStore } = useAuthStore(
    useShallow((state) => ({
      isModalOpen: state.isModalOpen,
      update: state.update,
      resetStore: state.resetStore,
    }))
  );

  const handleClose = () => {
    update({ isModalOpen: false });
    setTimeout(() => resetStore(), 150);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={
        <Box className='items-center justify-center'>
          <Logo size='l' />
        </Box>
      }
    >
      <Box className='mx-auto max-w-[364px] gap-4 px-[30px] pt-[30px]'>
        <AuthModalCurrentTab />
      </Box>
    </Modal>
  );
};

export default AuthModal;
