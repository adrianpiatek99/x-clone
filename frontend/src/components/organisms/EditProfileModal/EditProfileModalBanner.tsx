import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import Dropdown, { DropdownItem } from '@/components/atoms/Dropdown';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import ShimmerImage from '@/components/atoms/ShimmerImage';
import { FILE_VALIDATION_CONFIGS } from '@/constants/validation';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
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
    options: FILE_VALIDATION_CONFIGS.BANNER,
  });

  const handleRemoveBanner = () => updateBannerFile(null);

  return (
    <div className='relative grid place-items-center overflow-hidden bg-foreground'>
      <div className='relative block w-full pb-[33.333%]'>
        {bannerUrl && (
          <ShimmerImage className='object-cover' src={bannerUrl} alt='Profile banner' fill />
        )}
      </div>
      <Box className='absolute right-4 top-3 my-[-8px] mr-[-6px] flex-row'>
        <Dropdown>
          <IconButton title={t('actions.editBanner')} color='darker'>
            <Icon name='EditIcon' />
          </IconButton>
          <DropdownItem onClick={openFilePicker} icon={<Icon name='EditIcon' />}>
            {t('actions.addPhoto')}
          </DropdownItem>
          {bannerUrl ? (
            <DropdownItem onClick={handleRemoveBanner} icon={<Icon name='RemoveIcon' />} danger>
              {t('actions.removePhoto')}
            </DropdownItem>
          ) : null}
        </Dropdown>
      </Box>
      <input
        ref={filePickerRef}
        onChange={handleFileChange}
        accept={FILE_VALIDATION_CONFIGS.BANNER.ACCEPT.toString()}
        aria-label={t('actions.addPhoto')}
        type='file'
        hidden
      />
    </div>
  );
});
