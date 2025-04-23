import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { VALIDATION } from '@/constants/validation';
import { fileValidationConfigs } from '@/db/utils/validateFile';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import type { CreatePostStore } from '@/stores/createPost';
import { useTranslations } from 'next-intl';

type Props = Pick<CreatePostStore, 'addFiles'> & {
  filesCount: number;
  isPending: boolean;
};

export const CreatePostFormToolbar = memo(({ isPending, filesCount, addFiles }: Props) => {
  const t = useTranslations();
  const { addToast } = useToasts();
  const { handleFileChange, openFilePicker, filePickerRef } = useFileImagePicker({
    onSuccess: (files) => {
      addFiles(files);
    },
    onError: (error) => {
      addToast('error', error, { duration: 6000 });
    },
    options: fileValidationConfigs.media,
  });
  const mediaDisabled = filesCount >= VALIDATION.POST.MEDIA.LIMIT || isPending;

  return (
    <Box className='flex-row flex-wrap items-center justify-between'>
      <Box className='ml-[-6px] flex-row items-center gap-[2px]'>
        <IconButton
          title={t('post.actions.media')}
          size='small'
          onClick={openFilePicker}
          disabled={mediaDisabled}
        >
          <Icon name='MediaIcon' />
        </IconButton>
      </Box>
      <input
        multiple
        aria-label={t('post.actions.media')}
        ref={filePickerRef}
        type='file'
        onChange={handleFileChange}
        hidden
        accept={fileValidationConfigs.media.accept.toString()}
      />
    </Box>
  );
});
