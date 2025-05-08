import React, { memo, useState } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import AutoHeight from '@/components/molecules/AutoHeight';
import DiscardChangesModal from '@/components/molecules/DiscardChangesModal';
import { VALIDATION } from '@/constants/validation';
import { useEditPostStore } from '@/stores/editPost';
import type { Post } from '@/types/post';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { CreatePostFormToolbar } from '../CreatePostForm/CreatePostFormToolbar';
import { useEditPostModalForm } from './useEditPostModalForm';

const LazyEditPostModalMedia = dynamic(
  () => import('./EditPostModalMedia').then((mod) => mod.EditPostModalMedia),
  {
    loading: () => <Loader center />,
    ssr: false,
  }
);

type Props = {
  post: Pick<Post, 'id' | 'text' | 'author' | 'media'>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const EditPostModal = memo(({ post, isOpen, onClose, onSuccess }: Props) => {
  const {
    author: { avatarUrl, screenName },
    ...restPost
  } = post;
  const t = useTranslations();
  const { filesCount, addFiles } = useEditPostStore(
    useShallow((state) => ({ filesCount: state.files.length, addFiles: state.addFiles }))
  );
  const { AppField, handleSubmit, isPending, isChanged, disabled, showMedia } =
    useEditPostModalForm({
      post: restPost,
      isOpen,
      onClose,
      onSuccess,
    });
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);

  const handleClose = () => (isChanged ? setIsDiscardChangesModalOpen(true) : onClose());

  const onSubmit = () => {
    if (disabled || !isChanged) return;

    handleSubmit();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={t('post.actions.edit')}
        acceptButtonText={t('post.actions.edit')}
        acceptButtonProps={{
          disabled: disabled || !isChanged,
        }}
        panel={{ className: 'min-h-auto' }}
        isLoading={isPending}
        onAccept={onSubmit}
      >
        <Box className='flex-row px-4 py-3'>
          <Avatar src={avatarUrl} screenName={screenName} />
          <Box className='grow'>
            <form>
              <Box className='gap-4'>
                <AppField name='text'>
                  {(field) => (
                    <field.TextareaField
                      label={t('description')}
                      isLoading={isPending}
                      rows={3}
                      maxLength={VALIDATION.POST.TEXT.MAX}
                      disabled={isPending}
                    />
                  )}
                </AppField>
              </Box>
            </form>
            <Box className='gap-0'>
              <AutoHeight>
                {showMedia && <LazyEditPostModalMedia isPending={isPending} />}
              </AutoHeight>
              <CreatePostFormToolbar
                isPending={isPending}
                filesCount={filesCount}
                addFiles={addFiles}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        onDiscardClose={() => setIsDiscardChangesModalOpen(false)}
        onClose={onClose}
      />
    </>
  );
});

export default EditPostModal;
