import { useEffect, useMemo } from 'react';

import { useUpdatePostMutation } from '@/hooks/api/posts/mutations';
import { useAppForm } from '@/hooks/useFormHook';
import { useEditPostStore } from '@/stores/editPost';
import type { CreatePostRequest, Post } from '@/types/post';
import { useStore } from '@tanstack/react-form';
import { useShallow } from 'zustand/shallow';

type Props = {
  post: Pick<Post, 'id' | 'text' | 'media'>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const useEditPostModalForm = ({ post, isOpen, onClose, onSuccess }: Props) => {
  const { id, text, media } = post;
  const { files, update, resetStore } = useEditPostStore(
    useShallow((state) => ({
      files: state.files,
      update: state.update,
      resetStore: state.resetStore,
    }))
  );

  const { AppField, handleSubmit, store, reset } = useAppForm({
    defaultValues: {
      text,
    } satisfies Omit<CreatePostRequest, 'media'>,
    onSubmit: ({ value }) => {
      const removedMediaIds = media
        .filter((mediaItem) => !files.some((file) => file.preview === mediaItem.url))
        .map((mediaItem) => mediaItem.id);

      const newMediaFiles = files
        .filter((file) => !file.media && file.file)
        .map((file) => file.file as File);

      updatePost({
        id,
        text: value.text,
        removedMediaIds,
        media: newMediaFiles,
      });
    },
  });
  const formValues = useStore(store, (state) => state.values);

  const { updatePost, isPending } = useUpdatePostMutation({
    onSuccess: () => {
      resetStore();
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const isChanged = useMemo(() => {
    const isTextChanged =
      formValues.text?.replaceAll('\r\n', '\n').trim() !== text?.replaceAll('\r\n', '\n').trim();

    const isMediaChanged =
      files.some((file) => file.file) ||
      media.some((media) => !files.some((file) => file.preview === media.url));

    return isTextChanged || isMediaChanged;
  }, [formValues.text, text, files, media]);
  const disabled = !formValues.text || isPending;
  const showMedia = !!files.length;

  useEffect(() => {
    if (isOpen) {
      reset();
      update({
        files: media.map((media) => ({
          media,
          preview: media.url,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, media]);

  return { AppField, handleSubmit, reset, isPending, isChanged, disabled, showMedia };
};
