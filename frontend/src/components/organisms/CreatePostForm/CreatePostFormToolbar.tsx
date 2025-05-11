import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/atoms/IconButton';
import { FILE_VALIDATION_CONFIGS, VALIDATION } from '@/constants/validation';
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
    options: FILE_VALIDATION_CONFIGS.MEDIA,
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
        accept={FILE_VALIDATION_CONFIGS.MEDIA.ACCEPT.toString()}
      />
    </Box>
  );
});
