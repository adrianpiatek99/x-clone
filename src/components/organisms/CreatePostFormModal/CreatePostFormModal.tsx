import React, { lazy, Suspense } from 'react';

import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
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
    modal: { isOpen, text, files },
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
    createPostMutate({
      text,
      media: files.map((file) => file.file),
    });

  const handleChangeText = (value: string) => updateModal({ text: value });

  const onSubmit = () => {
    if (disabled) return;

    handleCreatePost();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('post.actions.send')}
      isLoading={isPending}
      acceptButtonText={t('post.actions.send')}
      acceptButtonProps={{
        disabled: disabled,
      }}
      onAccept={onSubmit}
      panel={{ className: 'min-h-auto' }}
    >
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
            <AutoHeight>
              {showMedia && (
                <Suspense fallback={<Loader center />}>
                  <LazyCreatePostFormMedia
                    isPending={isPending}
                    files={files}
                    removeFile={removeModalFile}
                  />
                </Suspense>
              )}
            </AutoHeight>
            <CreatePostFormToolbar
              isPending={isPending}
              filesCount={files.length}
              addFiles={addModalFiles}
            />
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

export default CreatePostFormModal;
