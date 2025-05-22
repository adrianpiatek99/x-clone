import Box from '@/components/atoms/Box';
import Modal from '@/components/atoms/Modal';
import { VALIDATION } from '@/constants/validation';
import type { ProfileUser } from '@/types/user';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { EditProfileModalAvatar } from './EditProfileModalAvatar';
import { EditProfileModalBanner } from './EditProfileModalBanner';
import { useEditProfileForm } from './useEditProfileForm';

const FORM_ID = 'edit-profile-modal-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: ProfileUser;
};

const EditProfileModal = ({ isOpen, onClose, user }: Props) => {
  const t = useTranslations();
  const { AppField, handleSubmit, isPending, isChanged } = useEditProfileForm({
    user,
    isOpen,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('profilePage.actions.edit')}
      isLoading={isPending}
      onAccept={handleSubmit}
      acceptButtonProps={{
        type: 'submit',
        disabled: !isChanged,
        form: FORM_ID,
      }}
      discardChanges={{
        isChanged,
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
                    maxLength={VALIDATION.ACCOUNT.NAME.MAX}
                  />
                )}
              </AppField>
              <AppField name='description'>
                {(field) => (
                  <field.TextareaField
                    label={t('description')}
                    isLoading={isPending}
                    rows={3}
                    maxLength={VALIDATION.ACCOUNT.DESCRIPTION.MAX}
                  />
                )}
              </AppField>
              <AppField name='url'>
                {(field) => (
                  <field.InputField
                    label={t('website')}
                    isLoading={isPending}
                    maxLength={VALIDATION.ACCOUNT.WEBSITE.MAX}
                  />
                )}
              </AppField>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
