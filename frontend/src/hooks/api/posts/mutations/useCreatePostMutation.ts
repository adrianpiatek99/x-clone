import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useToasts } from '@/hooks/useToasts';
import type {
  CreatePostRequest,
  CreatePostResponse,
  GetGlobalTimelineResponse,
  GetUserMediaResponse,
  GetUserPostsResponse,
} from '@/types/post';
import { apiRequest } from '@/utils/api';
import { createFormData } from '@/utils/formData';
import {
  addItemToInfiniteQueryCache,
  compareQueryKeys,
  updateTotalCountInInfiniteQueryCache,
} from '@/utils/queryCache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

type Props = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useCreatePostMutation = ({ onSuccess, onSettled }: Props = {}) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { addToast } = useToasts();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<CreatePostResponse, ApiAxiosError, CreatePostRequest>({
    mutationFn: (data) => {
      const formData = createFormData(data);

      return apiRequest('POST', API_ENDPOINTS.POSTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (newPost) => {
      addToast('success', t('post.api.createPost.success'));

      const hasMedia = newPost.media.length > 0;

      // Update the cache with the new post
      if (user) {
        addItemToInfiniteQueryCache<
          GetGlobalTimelineResponse | GetUserPostsResponse | GetUserMediaResponse
        >(
          queryClient,
          (queryKey) =>
            compareQueryKeys(queryKey, QUERY_KEYS.POSTS.GLOBAL_TIMELINE.BASE) ||
            compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(user.screenName)) ||
            (hasMedia &&
              compareQueryKeys(queryKey, QUERY_KEYS.POSTS.USER_MEDIA.WITH_PARAMS(user.screenName))),
          newPost,
          { itemsKey: 'posts' }
        );

        updateTotalCountInInfiniteQueryCache<GetUserPostsResponse>(
          queryClient,
          QUERY_KEYS.POSTS.USER_POSTS.WITH_PARAMS(user.screenName),
          (count) => count + 1
        );

        if (hasMedia) {
          updateTotalCountInInfiniteQueryCache<GetUserMediaResponse>(
            queryClient,
            QUERY_KEYS.POSTS.USER_MEDIA.WITH_PARAMS(user.screenName),
            (count) => count + 1
          );
        }
      }

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
