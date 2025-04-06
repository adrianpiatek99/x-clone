import React, { memo, useCallback, useEffect } from 'react';

import { IconButton, ShimmerImage } from '@/components/atoms';
import { Box } from '@/components/atoms/Box';
import { imageFileTypes } from '@/constants/fileTypes';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import { CameraPlusIcon } from '@/icons';
import { CloseIcon } from '@/icons';
import { useEditProfileStore } from '@/stores/editProfile';
import { fileValidationConfigs } from '@/utils/validateFile';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

export const EditProfileModalBanner = memo(() => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { bannerUrl, updateBannerFile } = useEditProfileStore(
    useShallow((state) => ({
      bannerUrl: state.banner.url,
      updateBannerFile: state.updateBannerFile,
    }))
  );
  const { files, error, handleFileChange, openFilePicker, filePickerRef, reset } =
    useFileImagePicker({ maxSize: fileValidationConfigs.banner.maxSize });

  const handleRemoveBanner = () => updateBannerFile(null);

  const handleBannerUpdate = useCallback(() => {
    if (files.length) {
      updateBannerFile(files[0]);
    } else if (error) {
      addToast('error', error, { duration: 6000 });
    }

    reset();
  }, [files, error, addToast, updateBannerFile, reset]);

  useEffect(() => {
    if (!!files.length || error) {
      handleBannerUpdate();
    }
  }, [files, error, handleBannerUpdate]);

  return (
    <div className='relative mx-0.5 grid place-items-center overflow-hidden bg-foreground'>
      <div className="relative block w-full pb-[33.333%] after:absolute after:inset-0 after:bg-[rgba(0,0,0,0.3)] after:content-['']">
        {bannerUrl && (
          <ShimmerImage className='object-cover' src={bannerUrl} alt='Profile banner' fill />
        )}
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
        {bannerUrl && (
          <IconButton
            onClick={handleRemoveBanner}
            title={t('actions.removePhoto')}
            color='darker'
            size='large'
          >
            <CloseIcon />
          </IconButton>
        )}
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
