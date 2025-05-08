import React from 'react';

import { ConfirmModal } from '@/components/atoms/ConfirmModal';
import { useLogoutMutation } from '@/hooks/api/auth/mutations/useLogoutMutation';
import { useGlobalStore } from '@/stores/global';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

const LogoutConfirmModal = () => {
  const t = useTranslations();
  const { isOpen, updateLogoutModal } = useGlobalStore(
    useShallow((state) => ({
      isOpen: state.logoutModal.isOpen,
      updateLogoutModal: state.updateLogoutModal,
    }))
  );
  const { logout } = useLogoutMutation();

  const handleClose = () => updateLogoutModal({ isOpen: false });

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <ConfirmModal
      title={t('auth.logout.confirmModal.title')}
      description={t('auth.logout.confirmModal.description')}
      acceptButtonText={t('auth.logout.text')}
      isOpen={isOpen}
      onClose={handleClose}
      onAccept={handleLogout}
    />
  );
};

export default LogoutConfirmModal;
