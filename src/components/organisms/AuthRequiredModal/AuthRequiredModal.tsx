import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import Typography from '@/components/atoms/Typography';
import { PeopleIcon } from '@/icons';
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

  const handleOpenSignInModal = () => {
    handleClose();
    update({ isModalOpen: true, currentTab: 'signIn' });
  };

  const handleOpenSignUpModal = () => {
    handleClose();
    update({ isModalOpen: true, currentTab: 'signUp' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Box className='items-center justify-center gap-6'>
        <PeopleIcon className='size-[54px] text-primary' />
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
            <Button className='rounded-full' onClick={handleOpenSignInModal} size='large'>
              {t('auth.signIn')}
            </Button>
            <Button
              className='rounded-full'
              onClick={handleOpenSignUpModal}
              variant='plain'
              size='large'
            >
              {t('auth.signUp')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthRequiredModal;
