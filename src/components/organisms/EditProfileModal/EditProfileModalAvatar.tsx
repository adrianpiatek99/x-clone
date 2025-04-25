import React, { memo } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { fileValidationConfigs } from '@/db/utils/validateFile';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import { useEditProfileStore } from '@/stores/editProfile';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

export const EditProfileModalAvatar = memo(() => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { avatarUrl, updateAvatarFile } = useEditProfileStore(
    useShallow((state) => ({
      avatarUrl: state.avatar.url,
      updateAvatarFile: state.updateAvatarFile,
    }))
  );
  const { handleFileChange, openFilePicker, filePickerRef } = useFileImagePicker({
    onSuccess: (files) => {
      updateAvatarFile(files[0]);
    },
    onError: (error) => {
      addToast('error', error, { duration: 6000 });
    },
    options: fileValidationConfigs.avatar,
  });

  return (
    <div className='relative mt-[-8%] grid w-full min-w-[48px] max-w-[116px]'>
      <div className='size-full rounded-full pb-[100%]'>
        <Avatar
          className='absolute inset-0 size-full border-[3px] border-foreground'
          onClick={openFilePicker}
          src={avatarUrl}
        />
      </div>
      <IconButton
        className='absolute right-0 '
        onClick={openFilePicker}
        title={t('actions.addPhoto')}
        color='darker'
      >
        <Icon name='EditIcon' />
      </IconButton>
      <input
        ref={filePickerRef}
        onChange={handleFileChange}
        accept={fileValidationConfigs.avatar.accept.toString()}
        aria-label={t('actions.addPhoto')}
        type='file'
        hidden
      />
    </div>
  );
});
