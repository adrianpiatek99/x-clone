import React, { lazy, memo, Suspense } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Box from '@/components/atoms/Box';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import AutoHeight from '@/components/molecules/AutoHeight';
import { VALIDATION } from '@/constants/validation';
import type { Post } from '@/db/schema';
import { useEditPostStore } from '@/stores/editPost';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/shallow';

import { CreatePostFormToolbar } from '../CreatePostForm/CreatePostFormToolbar';
import { useEditPostModalForm } from './useEditPostModalForm';

const LazyEditPostModalMedia = lazy(() =>
  import('./EditPostModalMedia').then((mod) => ({
    default: mod.EditPostModalMedia,
  }))
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

  const onSubmit = () => {
    if (disabled || !isChanged) return;

    handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              {showMedia && (
                <Suspense fallback={<Loader center />}>
                  <LazyEditPostModalMedia isPending={isPending} />
                </Suspense>
              )}
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
  );
});

export default EditPostModal;
