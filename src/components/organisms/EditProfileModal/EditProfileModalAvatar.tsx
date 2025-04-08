import React, { memo } from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { Box } from '@/components/atoms/Box';
import { IconButton } from '@/components/atoms/IconButton';
import { imageFileTypes } from '@/constants/fileTypes';
import { fileValidationConfigs } from '@/db/utils/validateFile';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import { CameraPlusIcon } from '@/icons';
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
    options: { maxSize: fileValidationConfigs.avatar.maxSize },
  });

  return (
    <div className='relative mt-[-8%] grid w-full min-w-[48px] max-w-[116px] place-items-center'>
      <div className="size-full rounded-full pb-[100%] after:absolute after:inset-0 after:rounded-full after:bg-[rgba(0,0,0,0.3)] after:content-['']">
        <Avatar
          className='absolute inset-0 size-full border-[3px] border-background'
          src={avatarUrl}
        />
      </div>
      <Box className='absolute flex-row'>
        <IconButton
          onClick={openFilePicker}
          title={t('actions.addPhoto')}
          color='darker'
          size='large'
        >
          <CameraPlusIcon />
        </IconButton>
      </Box>
      <input
        ref={filePickerRef}
        onChange={handleFileChange}
        accept={imageFileTypes.toString()}
        aria-label={t('actions.addPhoto')}
        type='file'
        hidden
      />
    </div>
  );
});
