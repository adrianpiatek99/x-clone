import type { CreatePostRequest, CreatePostResponse } from '@/app/api/posts/create/route';
import { API_ENDPOINTS } from '@/db/constants';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import { createFormData } from '@/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useCreatePostMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<CreatePostResponse, ApiAxiosError, CreatePostRequest>({
    mutationFn: (data) => {
      const formData = createFormData(data);

      return apiRequest('POST', API_ENDPOINTS.POSTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      addToast('success', t('post.api.createPost.success'));
      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.createPost.error'), { duration: 6000 });
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const createPostMutate = (data: CreatePostRequest) => {
    if (isPending) return;

    mutate(data);
  };

  return { createPostMutate, isPending };
};
