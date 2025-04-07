import React, { memo, useCallback, useEffect } from 'react';

import { Avatar, Box, IconButton } from '@/components/atoms';
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
  const { files, error, handleFileChange, openFilePicker, filePickerRef, reset } =
    useFileImagePicker({ maxSize: fileValidationConfigs.avatar.maxSize });

  const handleAvatarUpdate = useCallback(() => {
    if (files.length) {
      updateAvatarFile(files[0]);
    } else if (error) {
      addToast('error', error, { duration: 6000 });
    }

    reset();
  }, [files, error, addToast, updateAvatarFile, reset]);

  useEffect(() => {
    if (!!files.length || error) {
      handleAvatarUpdate();
    }
  }, [files, error, handleAvatarUpdate]);

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
