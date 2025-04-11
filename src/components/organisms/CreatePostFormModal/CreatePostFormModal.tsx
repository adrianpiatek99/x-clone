import React, { lazy, Suspense } from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import Textarea from '@/components/atoms/Textarea';
import AutoHeight from '@/components/molecules/AutoHeight';
import UserAvatar from '@/components/molecules/UserAvatar';
import { VALIDATION } from '@/constants/validation';
import { useCreatePostMutation } from '@/hooks/api/posts/useCreatePostMutation';
import { useCreatePostStore } from '@/stores/createPost';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { CreatePostFormToolbar } from '../CreatePostForm/CreatePostFormToolbar';

const LazyCreatePostFormMedia = lazy(() =>
  import('../CreatePostForm/CreatePostFormMedia').then((mod) => ({
    default: mod.CreatePostFormMedia,
  }))
);

const CreatePostFormModal = () => {
  const t = useTranslations();
  const {
    modal: { isOpen, text, files, aspectRatio },
    updateModal,
    addModalFiles,
    removeModalFile,
    resetModalStore,
  } = useCreatePostStore(
    useShallow((state) => ({
      modal: state.modal,
      updateModal: state.updateModal,
      addModalFiles: state.addModalFiles,
      removeModalFile: state.removeModalFile,
      resetModalStore: state.resetModalStore,
    }))
  );
  const { createPostMutate, isPending } = useCreatePostMutation({
    onSuccess: () => {
      resetModalStore();
    },
  });
  const disabled = !text || isPending;
  const showMedia = !!files.length;

  const handleClose = () => updateModal({ isOpen: false });

  const handleCreatePost = () =>
    !disabled &&
    createPostMutate({
      text,
      media: files.map((file) => file.file),
    });

  const handleChangeText = (value: string) => updateModal({ text: value });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} panel={{ className: 'min-h-auto' }}>
      <div className='flex gap-3 border-border-1 px-4'>
        <Box className='shrink-0 pt-2'>
          <UserAvatar withLink={false} />
        </Box>
        <Box className='grow'>
          <Textarea
            name='createPostText'
            label={t('post.textarea.label')}
            value={text}
            onValueChange={handleChangeText}
            maxLength={VALIDATION.POST.TEXT.MAX}
            rows={3}
            disabled={isPending}
          />
          <Box className='gap-0'>
            <AutoHeight duration={200}>
              <Suspense>
                {showMedia && (
                  <LazyCreatePostFormMedia
                    isPending={isPending}
                    files={files}
                    aspectRatio={aspectRatio}
                    removeFile={removeModalFile}
                    updateAspectRatio={(value) => updateModal({ aspectRatio: value })}
                  />
                )}
              </Suspense>
            </AutoHeight>
            <CreatePostFormToolbar
              isPending={isPending}
              filesCount={files.length}
              addFiles={addModalFiles}
            >
              <Button onClick={handleCreatePost} disabled={disabled} isLoading={isPending}>
                {t('post.actions.send')}
              </Button>
            </CreatePostFormToolbar>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

export default CreatePostFormModal;
