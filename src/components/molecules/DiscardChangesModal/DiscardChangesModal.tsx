import React from 'react';

import { ConfirmModal } from '@/components/atoms/ConfirmModal';
import { useTranslations } from 'next-intl';

type Props = {
  isOpen: boolean;
  isChanged: boolean;
  onDiscardClose: (accept: boolean) => void;
  onClose: () => void;
  onAccept?: () => void;
};

const DiscardChangesModal = ({ isOpen, isChanged, onDiscardClose, onClose, onAccept }: Props) => {
  const t = useTranslations();

  if (!isChanged) {
    return null;
  }

  const handleCloseDiscard = (accept: boolean) => {
    onDiscardClose(accept);

    if (accept) {
      onClose();
      onAccept?.();
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => handleCloseDiscard(false)}
      onAccept={() => handleCloseDiscard(true)}
      title={t('modal.discardChanges.title')}
      description={t('modal.discardChanges.description')}
      acceptButtonText={t('actions.discard')}
      danger
    />
  );
};

export default DiscardChangesModal;
