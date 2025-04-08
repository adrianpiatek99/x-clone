import React, { memo } from 'react';

import { Box } from '@/components/atoms/Box';
import { IconButton } from '@/components/atoms/IconButton';
import { ShimmerImage } from '@/components/atoms/ShimmerImage';
import { imageFileTypes } from '@/constants/fileTypes';
import { fileValidationConfigs } from '@/db/utils/validateFile';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import { CameraPlusIcon, CloseIcon } from '@/icons';
import { useEditProfileStore } from '@/stores/editProfile';
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
  const { handleFileChange, openFilePicker, filePickerRef } = useFileImagePicker({
    onSuccess: (files) => {
      updateBannerFile(files[0]);
    },
    onError: (error) => {
      addToast('error', error, { duration: 6000 });
    },
    options: { maxSize: fileValidationConfigs.banner.maxSize },
  });

  const handleRemoveBanner = () => updateBannerFile(null);

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
