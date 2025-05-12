import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import Modal from '@/components/atoms/Modal';
import Typography from '@/components/atoms/Typography';
import { useAuthStore } from '@/stores/auth';
import { useGlobalStore } from '@/stores/global';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

const AuthRequiredModal = () => {
  const t = useTranslations();
  const { isOpen, updateAuthRequiredModal } = useGlobalStore(
    useShallow((state) => ({
      isOpen: state.authRequiredModal.isOpen,
      updateAuthRequiredModal: state.updateAuthRequiredModal,
    }))
  );
  const { update } = useAuthStore(
    useShallow((state) => ({
      update: state.update,
    }))
  );

  const handleClose = () => updateAuthRequiredModal({ isOpen: false });

  const handleOpenLoginModal = () => {
    handleClose();
    update({ isModalOpen: true, currentTab: 'login' });
  };

  const handleOpenRegisterModal = () => {
    handleClose();
    update({ isModalOpen: true, currentTab: 'register' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Box className='items-center justify-center gap-6'>
        <Icon name='PeopleIcon' className='text-primary size-[54px]' />
        <Box className='max-w-[400px] gap-6 px-6'>
          <Box>
            <Typography as='h2' size='2xl' weight='bold' center>
              {t('auth.requiredModal.title')}
            </Typography>
            <Typography color='secondary' center>
              {t('auth.requiredModal.description')}
            </Typography>
          </Box>
          <Box>
            <Button className='rounded-full' onClick={handleOpenLoginModal} size='large'>
              {t('auth.login')}
            </Button>
            <Button
              className='rounded-full'
              onClick={handleOpenRegisterModal}
              variant='plain'
              size='large'
            >
              {t('auth.register')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthRequiredModal;
