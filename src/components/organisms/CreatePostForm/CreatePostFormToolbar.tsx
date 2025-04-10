import type { ReactNode } from 'react';
import React, { memo } from 'react';

import Box from '@/components/atoms/Box';
import IconButton from '@/components/atoms/IconButton';
import { imageFileTypes } from '@/constants/fileTypes';
import { POST_MEDIA_LIMIT, POST_MEDIA_SIZE_MB_LIMIT } from '@/db/constants';
import { useFileImagePicker } from '@/hooks/useFileImagePicker';
import { useToasts } from '@/hooks/useToasts';
import { MediaIcon } from '@/icons';
import type { CreatePostStore } from '@/stores/createPost';
import { useTranslations } from 'next-intl';

type Props = Pick<CreatePostStore, 'addFiles'> & {
  children: ReactNode;
  filesCount: number;
  isPending: boolean;
};

export const CreatePostFormToolbar = memo(
  ({ children, isPending, filesCount, addFiles }: Props) => {
    const t = useTranslations();
    const { addToast } = useToasts();
    const { handleFileChange, openFilePicker, filePickerRef } = useFileImagePicker({
      onSuccess: (files) => {
        addFiles(files);
      },
      onError: (error) => {
        addToast('error', error, { duration: 6000 });
      },
      options: { limit: POST_MEDIA_LIMIT, maxSize: POST_MEDIA_SIZE_MB_LIMIT },
    });
    const mediaDisabled = filesCount >= POST_MEDIA_LIMIT || isPending;

    return (
      <Box className='flex-row flex-wrap items-center justify-between'>
        <Box className='ml-[-6px] flex-row items-center gap-[2px]'>
          <IconButton
            title={t('post.actions.media')}
            size='small'
            onClick={openFilePicker}
            disabled={mediaDisabled}
          >
            <MediaIcon />
          </IconButton>
        </Box>
        <Box className='flex-row items-center'>{children}</Box>
        <input
          multiple
          aria-label={t('post.actions.media')}
          ref={filePickerRef}
          type='file'
          onChange={handleFileChange}
          hidden
          accept={imageFileTypes.toString()}
        />
      </Box>
    );
  }
);
