import { API_ENDPOINTS } from '@/constants/api';
import { useToasts } from '@/hooks/useToasts';
import type { CreatePostReplyRequest, CreatePostReplyResponse } from '@/types/post';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useCreatePostReplyMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<
    CreatePostReplyResponse,
    ApiAxiosError,
    CreatePostReplyRequest
  >({
    mutationFn: (data) => {
      const formData = createFormData(data);

      return apiRequest('POST', API_ENDPOINTS.POSTS.CREATE_POST_REPLY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      addToast('success', t('post.api.replyPost.success'));

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.replyPost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const createPostReply = (data: CreatePostReplyRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { createPostReply, isPending };
};
