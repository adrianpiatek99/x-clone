import { useToasts } from '@/hooks/useToasts';
import type { Post } from '@/types/post';
import { createFormData } from '@/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useReplyPostMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<void, ApiAxiosError, Record<string, unknown>>({
    mutationFn: (data) => {
      createFormData(data);

      return undefined;

      // return apiRequest('POST', API_ENDPOINTS.POSTS.CREATE, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
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

  const replyPost = (data: object) => {
    if (isPending) return;

    mutate(data);
  };

  return { replyPost, isPending };
};
