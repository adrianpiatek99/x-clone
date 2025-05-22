'use client';

import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Textarea from '@/components/atoms/Textarea';
import AutoHeight from '@/components/molecules/AutoHeight';
import UserAvatar from '@/components/molecules/UserAvatar';
import { VALIDATION } from '@/constants/validation';
import { useCreatePostMutation } from '@/hooks/api/posts/mutations';
import { useCreatePostStore } from '@/stores/createPost/store';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { CreatePostFormToolbar } from './CreatePostFormToolbar';

const LazyCreatePostFormMedia = dynamic(
  () => import('./CreatePostFormMedia').then((mod) => mod.CreatePostFormMedia),
  {
    loading: () => <Loader center />,
    ssr: false,
  }
);

const CreatePostForm = () => {
  const t = useTranslations();
  const { text, files, update, addFiles, removeFile, resetStore } = useCreatePostStore(
    useShallow((state) => ({
      text: state.text,
      files: state.files,
      update: state.update,
      addFiles: state.addFiles,
      removeFile: state.removeFile,
      resetStore: state.resetStore,
    }))
  );
  const { createPostMutate, isPending } = useCreatePostMutation({
    onSuccess: () => {
      resetStore();
    },
  });
  const disabled = !text || isPending;
  const showMedia = !!files.length;

  const handleCreatePost = () =>
    !disabled &&
    createPostMutate({
      text,
      media: files.map((file) => file.file),
    });

  const handleChangeText = (value: string) => update({ text: value });

  return (
    <div className='flex gap-3 border-border-1 px-4 py-3'>
      <Box className='shrink-0 pt-2'>
        <UserAvatar />
      </Box>
      <Box className='grow'>
        <Textarea
          name='createPostText'
          label={t('post.createPostLabel')}
          value={text}
          onValueChange={handleChangeText}
          maxLength={VALIDATION.POST.TEXT.MAX}
          disabled={isPending}
        />
        <Box className='gap-0'>
          <AutoHeight>
            {showMedia && (
              <LazyCreatePostFormMedia
                files={files}
                isPending={isPending}
                removeFile={removeFile}
              />
            )}
          </AutoHeight>
          <Box className='flex-row items-center justify-between'>
            <CreatePostFormToolbar
              isPending={isPending}
              filesCount={files.length}
              addFiles={addFiles}
            ></CreatePostFormToolbar>
            <Button onClick={handleCreatePost} disabled={disabled} isLoading={isPending}>
              {t('post.actions.send')}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreatePostForm;
