import type { GetUserPostsResponse } from '@/app/api/[screenName]/userPosts/route';
import type { CreatePostRequest, CreatePostResponse } from '@/app/api/posts/create/route';
import type { GetGlobalTimelineResponse } from '@/app/api/posts/globalTimeline/route';
import { useAuth } from '@/components/context/AuthContext';
import { API_ENDPOINTS } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiRequest } from '@/db/utils/api';
import { useToasts } from '@/hooks/useToasts';
import { createFormData } from '@/utils/formData';
import {
  addItemToInfiniteQueryCache,
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

      // Update the cache with the new post
      addItemToInfiniteQueryCache<GetGlobalTimelineResponse>(
        queryClient,
        QUERY_KEYS.POSTS.GLOBAL_TIMELINE,
        newPost,
        { itemsKey: 'posts' }
      );

      if (user) {
        addItemToInfiniteQueryCache<GetUserPostsResponse>(
          queryClient,
          QUERY_KEYS.POSTS.USER_POSTS(user.screenName),
          newPost,
          { itemsKey: 'posts' }
        );
        updateTotalCountInInfiniteQueryCache<GetUserPostsResponse>(
          queryClient,
          QUERY_KEYS.POSTS.USER_POSTS(user.screenName),
          (count) => count + 1
        );
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
