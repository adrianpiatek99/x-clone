import { useState } from 'react';

import Box from '@/components/atoms/Box';
import Modal from '@/components/atoms/Modal';
import DiscardChangesModal from '@/components/molecules/DiscardChangesModal';
import type { User } from '@/db/schema';
import {
  PROFILE_DESCRIPTION_MAX_LENGTH,
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_WEBSITE_MAX_LENGTH,
} from '@/schema';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { EditProfileModalAvatar } from './EditProfileModalAvatar';
import { EditProfileModalBanner } from './EditProfileModalBanner';
import { useEditProfileForm } from './useEditProfileForm';

const FORM_ID = 'edit-profile-modal-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

const EditProfileModal = ({ isOpen, onClose, user }: Props) => {
  const t = useTranslations();
  const { AppField, handleSubmit, isPending, isChanged } = useEditProfileForm({
    user,
    isOpen,
    onClose,
  });
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);

  const handleClose = () => (isChanged ? setIsDiscardChangesModalOpen(true) : onClose());

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={t('profilePage.actions.edit')}
        isLoading={isPending}
        onAccept={handleSubmit}
        acceptButtonProps={{
          type: 'submit',
          disabled: !isChanged,
          form: FORM_ID,
        }}
      >
        <Box className={twMerge('transition gap-0', isPending && 'opacity-50 pointer-events-none')}>
          <EditProfileModalBanner />
          <Box className='px-4 pb-8'>
            <EditProfileModalAvatar />
            <form
              id={FORM_ID}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <Box className='gap-4'>
                <AppField name='name'>
                  {(field) => (
                    <field.InputField
                      label={t('name')}
                      isLoading={isPending}
                      maxLength={PROFILE_NAME_MAX_LENGTH}
                    />
                  )}
                </AppField>
                <AppField name='description'>
                  {(field) => (
                    <field.TextareaField
                      label={t('description')}
                      isLoading={isPending}
                      rows={3}
                      maxLength={PROFILE_DESCRIPTION_MAX_LENGTH}
                    />
                  )}
                </AppField>
                <AppField name='url'>
                  {(field) => (
                    <field.InputField
                      label={t('website')}
                      isLoading={isPending}
                      maxLength={PROFILE_WEBSITE_MAX_LENGTH}
                    />
                  )}
                </AppField>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        isChanged={isChanged}
        onDiscardClose={() => setIsDiscardChangesModalOpen(false)}
        onClose={onClose}
      />
    </>
  );
};

export default EditProfileModal;
