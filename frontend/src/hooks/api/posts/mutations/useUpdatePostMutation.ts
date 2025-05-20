import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import type {
  GetGlobalTimelineResponse,
  GetPostDetailsResponse,
  GetUserLikesResponse,
  GetUserPostsResponse,
  UpdatePostParams,
  UpdatePostRequest,
  UpdatePostResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import {
  compareQueryKeys,
  updateItemInCache,
  updateItemInInfiniteQueryCache,
} from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useUpdatePostMutation = ({ onSuccess, onError, onSettled }: Props = {}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const { mutate, isPending } = useMutation<
    UpdatePostResponse,
    ApiAxiosError,
    UpdatePostRequest & UpdatePostParams
  >({
    mutationFn: ({ id, ...data }) => {
      const formData = createFormData(data);

      return apiRequest('PATCH', API_ENDPOINTS.POSTS.UPDATE({ id }), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (updatedPost) => {
      addToast('success', t('post.api.updatePost.success'));

      // Update the cache with the updated post
      updateItemInInfiniteQueryCache<
        GetGlobalTimelineResponse | GetUserPostsResponse | GetUserLikesResponse
      >(
        queryClient,
        (queryKey) =>
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.BASE) ||
          compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_LIKES.BASE),
        updatedPost.id,
        (post) => Object.assign(post, updatedPost),
        { itemsKey: 'posts' }
      );

      updateItemInCache<GetPostDetailsResponse>(
        queryClient,
        QUERY_KEYS.POSTS.DETAILS(updatedPost.id),
        (post) => Object.assign(post, updatedPost)
      );

      onSuccess?.();
    },
    onError: () => {
      addToast('error', t('post.api.updatePost.error'), { duration: 6000 });

      onError?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const updatePost = (data: UpdatePostRequest & UpdatePostParams) => {
    if (isPending) return;

    mutate(data);
  };

  return { updatePost, isPending };
};
